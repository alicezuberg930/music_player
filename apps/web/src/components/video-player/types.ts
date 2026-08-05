export type VideoPlayerProps = {
    videoUrl: string
}

export type MinimalHlsPlayer = {
    loadSource: (source: string) => void
    attachMedia: (mediaElement: HTMLMediaElement) => void
    destroy: () => void
    static?: {
        isSupported?: () => boolean
    }
}