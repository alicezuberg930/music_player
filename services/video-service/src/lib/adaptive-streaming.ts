import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { DimensionInfo, HLS_QUALITIES, HlsQuality, presets, SelectedQuality, StreamOutput } from './@types/adaptive-streaming'

const execFileAsync = promisify(execFile)
let transcodeLibraryCheck: Promise<void> | null = null
const transcodeJobs = new Map<string, Promise<string>>()
const defaultOutputDirectory = path.join(process.cwd(), 'tmp', 'adaptive-streams')
const masterPlaylist = 'master.m3u8'

const runCommand = async (command: string, args: string[]): Promise<string> => {
    const { stdout } = await execFileAsync(command, args, {
        windowsHide: true,
        maxBuffer: 1024 * 1024 * 20,
    })
    return stdout
}

const isTranscodeLibrary = async (): Promise<void> => {
    if (!transcodeLibraryCheck) {
        transcodeLibraryCheck = (async () => {
            const missing: string[] = []
            await runCommand('ffmpeg', ['-version']).catch(() => {
                missing.push('ffmpeg')
            })
            await runCommand('ffprobe', ['-version']).catch(() => {
                missing.push('ffprobe')
            })
            if (missing.length > 0) {
                throw new Error(`Adaptive streaming requires ${missing.join(' and ')} in PATH`)
            }
        })()
    }
    return transcodeLibraryCheck
}

const withTranscodeLock = async (cacheKey: string, task: () => Promise<string>): Promise<string> => {
    const existing = transcodeJobs.get(cacheKey)
    if (existing) return existing

    const inFlight = task().then(value => {
        transcodeJobs.delete(cacheKey)
        return value
    }).catch(error => {
        transcodeJobs.delete(cacheKey)
        throw error
    })

    transcodeJobs.set(cacheKey, inFlight)
    return inFlight
}

const toEven = (value: number): number => {
    const rounded = Math.round(value)
    if (rounded < 2) return 2
    return rounded % 2 === 0 ? rounded : rounded - 1
}

const resolveQuality = (value: string | undefined): HlsQuality | undefined => {
    if (!value) return undefined
    const normalized = value.toLowerCase().trim()
    const target = normalized.endsWith('p') ? normalized : `${normalized}p`
    return HLS_QUALITIES.includes(target as HlsQuality) ? (target as HlsQuality) : undefined
}

const getSourceDimension = async (sourceUrl: string): Promise<DimensionInfo | null> => {
    const output = await runCommand('ffprobe', [
        '-v',
        'error',
        '-print_format',
        'json',
        '-show_streams',
        sourceUrl
    ])

    const parsed = JSON.parse(output) as { streams?: Array<{ codec_type?: string; width?: number; height?: number;[key: string]: unknown }> }
    const videoStream = parsed.streams?.find(stream => stream.codec_type === 'video')
    if (!videoStream?.width || !videoStream?.height) return null
    const hasAudio = parsed.streams?.some(stream => stream.codec_type === 'audio') ?? false

    return {
        width: videoStream.width,
        height: videoStream.height,
        hasAudio,
    }
}

const buildVariantSize = (sourceWidth: number, sourceHeight: number, shortEdge: number): { width: number; height: number } => {
    const sourceShortEdge = Math.min(sourceWidth, sourceHeight)
    if (sourceShortEdge <= shortEdge) return { width: sourceWidth, height: sourceHeight }

    const landscape = sourceWidth >= sourceHeight
    if (landscape) {
        const height = shortEdge
        const width = toEven((sourceWidth * height) / sourceHeight)
        return { width, height }
    }

    const width = shortEdge
    const height = toEven((sourceHeight * width) / sourceWidth)
    return { width, height: Math.min(height, sourceHeight) }
}

const selectQualities = (maxQuality: HlsQuality | undefined, sourceInfo: DimensionInfo | null): SelectedQuality[] => {
    const fallback: HlsQuality = '1080p'
    const requestedQuality = maxQuality ?? fallback
    const requestedPreset = presets.find(preset => preset.quality === requestedQuality)
    const requestedShortEdge = requestedPreset?.shortEdge ?? presets[presets.length - 1]!.shortEdge

    if (!sourceInfo) {
        return presets
            .filter(preset => preset.shortEdge <= requestedShortEdge)
            .map(preset => ({
                ...preset,
                width: Math.max(preset.shortEdge, 2),
                height: Math.max(preset.shortEdge, 2)
            }))
    }

    const sourceShortEdge = Math.min(sourceInfo.width, sourceInfo.height)
    const targetShortEdge = Math.min(sourceShortEdge, requestedShortEdge)
    const validPresets = presets.filter(preset => preset.shortEdge <= targetShortEdge)

    if (validPresets.length === 0) {
        const fallbackQuality = presets[0]!
        return [{
            ...fallbackQuality,
            width: sourceInfo.width,
            height: sourceInfo.height
        }]
    }

    return validPresets.map((preset) => {
        const { width, height } = buildVariantSize(sourceInfo.width, sourceInfo.height, preset.shortEdge)
        return {
            ...preset,
            width,
            height
        }
    })
}

const ensureAdaptivePlaylist = async (
    sourceUrl: string,
    outputPath: string,
    maxQuality: HlsQuality | undefined
): Promise<string> => {
    const cacheKey = outputPath
    return withTranscodeLock(cacheKey, async () => {
        const masterPath = path.join(outputPath, masterPlaylist)
        if (existsSync(masterPath)) return masterPath

        const sourceInfo = await getSourceDimension(sourceUrl).catch(() => null)
        const selected = selectQualities(maxQuality, sourceInfo)
        const hasAudio = sourceInfo?.hasAudio ?? false

        const targetDir = outputPath
        const segmentPattern = path.join(targetDir, 'v%v', 'segment_%03d.ts')
        const playlistTemplate = path.join(targetDir, 'v%v', 'index.m3u8')
        const args: string[] = ['-hide_banner', '-loglevel', 'error', '-y', '-i', sourceUrl]

        selected.forEach((quality, index) => {
            args.push('-map', '0:v:0')
            if (hasAudio) args.push('-map', '0:a:0')

            args.push(`-c:v:${index}`, 'libx264')
            args.push(`-profile:v:${index}`, 'main')
            args.push(`-pix_fmt:v:${index}`, 'yuv420p')
            args.push(`-b:v:${index}`, quality.videoBitrate)
            args.push(`-maxrate:v:${index}`, quality.maxrate)
            args.push(`-bufsize:v:${index}`, quality.bufsize)
            args.push(`-s:v:${index}`, `${toEven(quality.width)}x${toEven(quality.height)}`)
            args.push(`-preset:v:${index}`, 'veryfast')
            if (hasAudio) {
                args.push(`-c:a:${index}`, 'aac')
                args.push(`-b:a:${index}`, quality.audioBitrate)
                args.push(`-ar:a:${index}`, '48000')
                args.push(`-ac:a:${index}`, '2')
            }
        })

        const streamMap = selected.map((_, index) => hasAudio ? `v:${index},a:${index}` : `v:${index}`).join(' ')

        args.push(
            '-f',
            'hls',
            '-hls_time',
            '4',
            '-hls_list_size',
            '0',
            '-hls_flags',
            'independent_segments',
            '-hls_segment_type',
            'mpegts',
            '-hls_segment_filename',
            segmentPattern,
            '-master_pl_name',
            masterPlaylist,
            '-var_stream_map',
            streamMap,
            '-hls_playlist_type',
            'vod',
            playlistTemplate
        )

        await fs.mkdir(targetDir, { recursive: true })
        await runCommand('ffmpeg', args)
        return masterPath
    })
}

const rewriteManifest = (content: string, requestPath: string, resourcePath: string): string => {
    const basePath = path.dirname(resourcePath)
    const normalizedBase = basePath === '.' ? '' : `${basePath}/`
    return content
        .split(/\r?\n/)
        .map(line => {
            if (!line || line.startsWith('#')) return line
            if (line.includes('://')) return line
            const rewritten = `${normalizedBase}${line}`
            return `${requestPath}?hls=1&resource=${encodeURIComponent(rewritten)}`
        })
        .join('\n')
}

const readStreamAsset = async (outputPath: string, resource: string): Promise<StreamOutput> => {
    const decodedResource = decodeURIComponent(resource)
    const safeSegments = decodedResource
        .split(/[\\/]+/)
        .filter(segment => segment.length > 0 && segment !== '.' && segment !== '..')
    const safeResource = safeSegments.join(path.sep)
    if (!safeResource) throw new Error('Invalid resource path')
    const filePath = path.join(outputPath, safeResource)
    const absoluteOutput = path.resolve(outputPath)
    const absoluteFile = path.resolve(filePath)
    if (!absoluteFile.startsWith(absoluteOutput + path.sep) && absoluteFile !== absoluteOutput) {
        throw new Error('Invalid resource path')
    }
    const body = await fs.readFile(absoluteFile)
    const ext = path.extname(absoluteFile)
    if (ext === '.m3u8') return { body, contentType: 'application/vnd.apple.mpegurl' }
    if (ext === '.ts') return { body, contentType: 'video/MP2T' }
    return { body, contentType: 'application/octet-stream' }
}

const resolveAdaptiveStream = async ({
    videoId, sourceUrl, requestPath, maxQuality
}: {
    videoId: string
    sourceUrl: string
    requestPath: string
    maxQuality?: HlsQuality
    resource?: string
}): Promise<StreamOutput> => {
    await isTranscodeLibrary()
    const qualityDir = maxQuality ? maxQuality : 'auto'
    const outputPath = path.join(defaultOutputDirectory, videoId, qualityDir)

    const resourceName = masterPlaylist
    await ensureAdaptivePlaylist(sourceUrl, outputPath, maxQuality).catch((error) => {
        const message = error instanceof Error ? error.message : 'Failed to create HLS assets'
        throw new Error(`Adaptive stream generation failed: ${message}`)
    })

    const output = await readStreamAsset(outputPath, resourceName).catch(error => {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            throw new Error(`Adaptive stream asset not ready yet: ${resourceName}`)
        }
        throw error
    })

    if (path.extname(resourceName).toLowerCase() === '.m3u8') {
        const rewrittenBody = rewriteManifest(
            output.body.toString('utf8'),
            requestPath,
            resourceName
        )
        return { body: Buffer.from(rewrittenBody, 'utf8'), contentType: output.contentType }
    }

    return output
}

export { resolveQuality, resolveAdaptiveStream }