import * as Yup from 'yup'
import { useCallback, useEffect, useState } from 'react'
import { RotatingLines } from 'react-loader-spinner'
import { createSong, fetchArtistList } from '@/lib/httpClient'
// types
import type { Response } from '@/@types/response'
import type { Artist } from '@/@types/artist'
import type { Song } from '@/@types/song'
import { type CustomFile } from '@/components/upload'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// components
import { FormProvider, RHFMultiSelect, RHFSingleDatePicker, RHFTextField } from '@/components/hook-form'
import { RHFUpload } from '@/components/hook-form/RHFUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSnackbar } from '@/components/snackbar'
import { useLocales } from '@/lib/locales'

type FormValuesProps = {
    audio: CustomFile | string
    lyrics?: CustomFile | string
    thumbnail?: CustomFile | string
    title: string
    releaseDate: string
    artistIds: string[]
}

const UploadMusicPage: React.FC<{ editSong?: Song, id?: string }> = ({ editSong, id }) => {
    console.log(id)
    const [artists, setArtists] = useState<Artist[]>([])
    const { enqueueSnackbar } = useSnackbar()
    const { translate } = useLocales()

    useEffect(() => {
        const a = async () => {
            const response = await fetchArtistList()
            setArtists(response.data || [])
        }
        a()
    }, [])

    const SongSchema: Yup.ObjectSchema<FormValuesProps> = Yup.object().shape({
        audio: Yup.mixed<CustomFile | string>().required(translate('song_audio_file_is_required')),
        lyrics: Yup.mixed<CustomFile | string>().optional(),
        thumbnail: Yup.mixed<CustomFile | string>().optional()
            .test('aspect-ratio', translate('thumbnail_must_be_square'), value => {
                if (!value || typeof value === 'string') return true
                const img = new Image()
                img.onload = () => {
                    URL.revokeObjectURL(img.src)
                    return img.naturalWidth / img.naturalHeight === 1
                }
                img.onerror = () => {
                    URL.revokeObjectURL(img.src)
                    return false
                }
                img.src = URL.createObjectURL(value as File)
            }),
        title: Yup.string().required(translate('song_name_is_required')),
        releaseDate: Yup.string().required(translate('song_release_date_is_required')),
        artistIds: Yup.array().min(1, translate('at_least_one_artist_required')).required(translate('artist_is_required')),
    })

    const defaultValues = {
        lyrics: editSong?.lyricsFile || undefined,
        thumbnail: editSong?.thumbnail || undefined,
        title: editSong?.title || '',
        releaseDate: editSong?.releaseDate || '',
        artistIds: editSong?.artists.map(artist => artist.id) || []
    }

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(SongSchema),
        defaultValues,
    })

    const {
        setValue,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = methods

    const onSubmit = async (data: FormValuesProps) => {
        try {
            const formData = new FormData()
            for (const [key, value] of Object.entries(data)) {
                if (value !== undefined) formData.append(key, value as string | Blob)
            }
            let response: Response = await createSong(formData)
            if (response?.statusCode && response?.statusCode === 201) {
                reset()
                enqueueSnackbar(response.message, { variant: 'success' })
            } else {
                enqueueSnackbar(translate(response.message), { variant: 'error' })
            }
        } catch (error) {
            console.log(error)
            enqueueSnackbar(translate('unknown_error'), { variant: 'error' })
        }
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
        const newFile = Object.assign(file, {
            preview: URL.createObjectURL(file),
        })
        if (file) setValue('thumbnail', newFile, { shouldValidate: true })
    }, [setValue])

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col md:flex-row gap-6'>
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
                                    <RotatingLines strokeColor="white" />
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
                                onDelete={() => setValue('audio', '', { shouldValidate: true })}
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </FormProvider >
    )
}

export default UploadMusicPage