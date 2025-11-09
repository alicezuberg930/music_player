export const esmFileType = async () => {
    return await import('file-type').then(m => m)
}

export const esmMusicMetadata = async () => {
    return await import('music-metadata').then(m => m)
}