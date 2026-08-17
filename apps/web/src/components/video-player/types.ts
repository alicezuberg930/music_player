export const VIDEO_QUALITIES = ['240p', '360p', '480p', '720p', '1080p'] as const

export type VideoQuality = (typeof VIDEO_QUALITIES)[number]
export type VideoQualitySelection = 'auto' | VideoQuality

export type VideoPlayerProps = {
    videoId: string
}

export type VideoStreamResponse = {
    url: string
    quality: VideoQualitySelection
    qualities: VideoQuality[]
}

export type MinimalHlsPlayer = {
    loadSource: (source: string) => void
    attachMedia: (mediaElement: HTMLMediaElement) => void
    destroy: () => void
    static?: {
        isSupported?: () => boolean
    }
}
