import * as Yup from 'yup'
import { useCallback, useEffect, useState } from 'react'
import { RotatingLines } from 'react-loader-spinner'
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
import { createSong, fetchArtistList } from '@/lib/http.client'
import { useSnackbar } from '@/components/snackbar'

type FormValuesProps = {
    audio: CustomFile | string
    lyrics?: CustomFile | string
    thumbnail?: CustomFile | string
    title: string
    releaseDate: string
    artistIds: string[]
}

const UploadMusicPage: React.FC<{ editSong?: Song, id?: string }> = ({ editSong, id }) => {
    const [artists, setArtists] = useState<Artist[]>([])
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        const a = async () => {
            const response = await fetchArtistList()
            setArtists(response.data || [])
        }
        a()
    }, [])

    const SongSchema: Yup.ObjectSchema<FormValuesProps> = Yup.object().shape({
        audio: Yup.mixed<CustomFile | string>().required('Audio file is required'),
        lyrics: Yup.mixed<CustomFile | string>().optional(),
        thumbnail: Yup.mixed<CustomFile | string>().optional(),
        title: Yup.string().required('Title is required'),
        releaseDate: Yup.string().required('Release date is required'),
        artistIds: Yup.array().min(1, 'At least one artist is required').required('Artist is required'),
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
            Object.entries(data).forEach(([key, value]) => formData.append(key, value as string | Blob))
            let response: Response
            if (id) {
                response = await createSong(formData)
            } else {
                response = await createSong(formData)
            }
            if (response && response.statusCode === 201) {
                reset()
                enqueueSnackbar('Bài hát tải lên thành công', { variant: 'success' })
            } else {
                enqueueSnackbar('Có lỗi xảy ra khi tải lên bài hát', { variant: 'error' })
            }
        } catch (error) {
            console.error(error)
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
                            <RHFTextField name='title' fieldLabel='Tên bài hát' placeholder='Tên bài hát' />
                            <RHFSingleDatePicker name='releaseDate' fieldLabel='Ngày công bố' placeholder='Chọn ngày phát hành' />
                            <RHFMultiSelect
                                name='artistIds' fieldLabel='Nghệ sĩ'
                                options={artists.map(artist => ({ label: artist.name, value: artist.id }))}
                                placeholder='Chọn nghệ sĩ'
                            />
                            <Button type="submit" size={'lg'} className='w-full' disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <RotatingLines strokeColor="white" />
                                ) : (
                                    'Tải nhạc lên'
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
                                fieldLabel='Tập tin âm thanh'
                            />
                            <RHFUpload
                                name='lyrics'
                                maxSize={3145728}
                                accept={{ 'text/plain': ['.txt', '.lrc'] }}
                                onDrop={handleDropLyrics}
                                onDelete={() => setValue('lyrics', undefined, { shouldValidate: true })}
                                fieldLabel='Tập tin lời bài hát'
                            />
                            <RHFUpload
                                name='thumbnail'
                                maxSize={3145728}
                                onDrop={handleDropThumbnail}
                                onDelete={() => setValue('thumbnail', undefined, { shouldValidate: true })}
                                fieldLabel='Ảnh bìa bài hát'
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </FormProvider >
    )
}

export default UploadMusicPage