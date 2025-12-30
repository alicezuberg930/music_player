import * as z from 'zod'
import { useLocales } from '@/lib/locales'
import { SongValidators } from '@yukikaze/validator'
import { useCallback } from 'react'
import { useApi } from '@/hooks/useApi'
// types
import type { Song } from '@/@types/song'
import { type CustomFile } from '@/components/upload'
// form
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// components
import { FormProvider, RHFMultiSelect, RHFSingleDatePicker, RHFTextField } from '@/components/hook-form'
import { RHFUpload } from '@/components/hook-form/RHFUpload'
import { Button } from '@yukikaze/ui/button'
import { Card, CardContent } from '@yukikaze/ui/card'
import { Spinner } from '@yukikaze/ui/spinner'

type FormValuesProps = SongValidators.CreateSongInput & {
    audio: CustomFile | string | null
    lyrics?: CustomFile | string
    thumbnail?: CustomFile | string
}

const UploadMusicPage: React.FC<{ editSong?: Song, id?: string }> = ({ editSong, id }) => {
    console.log(id)
    const { translate } = useLocales()
    const { useCreateSong, useArtistList } = useApi()
    const { data: artistsData } = useArtistList()
    const artists = artistsData?.data || []
    const { mutateAsync: createSong } = useCreateSong()

    // song_name_is_required
    // song_release_date_is_required
    // at_least_one_artist_required
    const SongSchema = SongValidators.createSongInput.extend({
        audio: z.custom<CustomFile | string | null>((val) => val !== null && val !== '', {
            message: translate('song_audio_file_is_required'),
        }),
        thumbnail: z.union([z.instanceof(File), z.string()]).optional(),
        lyrics: z.union([z.instanceof(File), z.string()]).optional(),
    })

    const defaultValues = {
        lyrics: editSong?.lyricsFile || undefined,
        thumbnail: editSong?.thumbnail || undefined,
        title: editSong?.title || '',
        releaseDate: editSong?.releaseDate || '',
        artistIds: editSong?.artists?.map(artist => artist.id) || []
    }

    const methods = useForm<FormValuesProps>({
        resolver: zodResolver(SongSchema),
        defaultValues,
    })

    const {
        setError,
        setValue,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = methods

    const onSubmit = async (data: FormValuesProps) => {
        const formData = new FormData()
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                // Serialize arrays/objects as JSON strings
                if (Array.isArray(value) || (typeof value === 'object' && value !== null && !(value instanceof File))) {
                    formData.append(key, JSON.stringify(value))
                } else {
                    formData.append(key, value as Blob)
                }
            }
        }
        await createSong(formData, {
            onSuccess: () => reset()
        })
    }

    const handleDropAudio = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        const newFile = Object.assign(file, {
            preview: URL.createObjectURL(file),
        })
        if (file) setValue('audio', newFile, { shouldValidate: true })
    }, [setValue])

    const handleDropLyrics = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        const newFile = Object.assign(file, {
            preview: URL.createObjectURL(file),
        })
        if (file) setValue('lyrics', newFile, { shouldValidate: true })
    }, [setValue])

    const handleDropThumbnail = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return
        const img = new window.Image()
        img.src = URL.createObjectURL(file)
        img.onload = () => {
            URL.revokeObjectURL(img.src)
            if (img.naturalWidth / img.naturalHeight !== 1) {
                setError('thumbnail', { type: 'manual', message: translate('thumbnail_must_be_square') })
            } else {
                const newFile = Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
                setValue('thumbnail', newFile, { shouldValidate: true })
            }
        }
        img.onerror = () => {
            URL.revokeObjectURL(img.src)
            setError('thumbnail', { type: 'manual', message: translate('thumbnail_must_be_square') })
        }
    }, [setValue, setError, translate])

    // const handleDropMultiFile = useCallback(
    //     (acceptedFiles: File[]) => {
    //         const files = multiUpload || [];

    //         const newFiles = acceptedFiles.map((file) =>
    //             Object.assign(file, {
    //                 preview: URL.createObjectURL(file),
    //             })
    //         );

    //         setValue('multiUpload', [...files, ...newFiles], { shouldValidate: true });
    //     },
    //     [setValue, multiUpload]
    // );

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col md:flex-row gap-6 mt-6'>
                <div className='w-full md:w-2/3'>
                    <Card>
                        <CardContent className="space-y-4">
                            <RHFTextField name='title' fieldLabel={translate('song_name')} placeholder={translate('enter_song_name')} />
                            <RHFSingleDatePicker name='releaseDate' fieldLabel={translate('release_date')} placeholder={translate('select_release_date')} />
                            <RHFMultiSelect
                                name='artistIds' fieldLabel={translate('artist_name')}
                                options={artists.map(artist => ({ label: artist.name, value: artist.id }))}
                                placeholder={translate('select_artist')}
                            />
                            <Button type="submit" size={'lg'} className='w-full' disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <Spinner className='size-6' />
                                ) : (
                                    translate('upload_music')
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className='w-full md:w-1/3'>
                    <Card>
                        <CardContent className="space-y-4">
                            <RHFUpload
                                name='audio'
                                maxSize={15728640}
                                accept={{ 'audio/*': [] }}
                                onDrop={handleDropAudio}
                                onDelete={() => setValue('audio', null, { shouldValidate: true })}
                                fieldLabel={translate('song_audio_file')}
                            />
                            <RHFUpload
                                name='lyrics'
                                maxSize={3145728}
                                accept={{ 'text/plain': ['.txt', '.lrc'] }}
                                onDrop={handleDropLyrics}
                                onDelete={() => setValue('lyrics', undefined, { shouldValidate: true })}
                                fieldLabel={translate('song_lyrics_file')}
                            />
                            <RHFUpload
                                name='thumbnail'
                                maxSize={3145728}
                                onDrop={handleDropThumbnail}
                                onDelete={() => setValue('thumbnail', undefined, { shouldValidate: true })}
                                fieldLabel={translate('song_thumbnail_image')}
                            />
                            {/* <RHFUpload
                                multiple
                                thumbnail
                                name="multiUpload"
                                maxSize={3145728}
                                onDrop={handleDropMultiFile}
                                onRemove={(inputFile) =>
                                    setValue(
                                        'multiUpload',
                                        multiUpload &&
                                        multiUpload.filter((file) => file !== inputFile),
                                        { shouldValidate: true }
                                    )
                                }
                                onRemoveAll={() => setValue('multiUpload', [], { shouldValidate: true })}
                                onUpload={() => console.log('ON UPLOAD')}
                                fieldLabel={translate('song_thumbnail_image')}
                            /> */}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </FormProvider >
    )
}

export default UploadMusicPage