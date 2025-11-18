export type Song = {
    duration: number;
    id: number;
    title: string;
    alias: string;
    artistNames: string;
    isWorldWide: boolean | null;
    thumbnail: string;
    lyricsFile: string | null;
    isPrivate: boolean | null;
    releaseDate: string | null;
    distributor: string | null;
    stream: string;
    isIndie: boolean | null;
    mvlink: string | null;
    hasLyrics: boolean | null;
    createdAt: string;
    updatedAt: string;
    userId: number;
    likes: number | null;
    listens: number | null;
    liked: boolean | null;
    comments: number | null;
    size: number;
}

export type IMusicState = {
    isPlaying: boolean
    recentSongs: Song[]
    currentSongs: Song[]
    isPlaylist: boolean
    currentSong: Song | null
    currentPlaylistName: string | null
}