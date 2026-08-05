export const HLS_QUALITIES = ['240p', '360p', '480p', '720p', '1080p'] as const

export type HlsQuality = (typeof HLS_QUALITIES)[number]

export type DimensionInfo = {
    width: number
    height: number
    hasAudio: boolean
}

export type QualityPreset = {
    quality: HlsQuality
    shortEdge: number
    videoBitrate: string
    maxrate: string
    bufsize: string
    audioBitrate: string
}

export type SelectedQuality = QualityPreset & {
    width: number
    height: number
}

export const presets: QualityPreset[] = [
    { quality: '240p', shortEdge: 240, videoBitrate: '300k', maxrate: '360k', bufsize: '720k', audioBitrate: '64k' },
    { quality: '360p', shortEdge: 360, videoBitrate: '700k', maxrate: '840k', bufsize: '1680k', audioBitrate: '96k' },
    { quality: '480p', shortEdge: 480, videoBitrate: '1200k', maxrate: '1400k', bufsize: '2800k', audioBitrate: '96k' },
    { quality: '720p', shortEdge: 720, videoBitrate: '2500k', maxrate: '3000k', bufsize: '5000k', audioBitrate: '128k' },
    { quality: '1080p', shortEdge: 1080, videoBitrate: '4500k', maxrate: '5400k', bufsize: '9000k', audioBitrate: '160k' },
]

export type StreamOutput = {
    body: Buffer
    contentType: string
}