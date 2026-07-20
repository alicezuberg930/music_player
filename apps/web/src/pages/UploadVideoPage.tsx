import * as z from 'zod'
import { useLocales } from '@/lib/locales'
import { VideoValidators } from '@yukikaze/validator'
import { useCallback } from 'react'
// types
import type { Video } from '@/@types'
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
import { useMutation, useQuery } from '@tanstack/react-query'
import { videoQueries } from '@/lib/queries/video'
import { toast } from '@yukikaze/ui'
import { artistQueries } from '@/lib/queries/artist'

type FormValuesProps = VideoValidators.CreateVideoInput & {
    stream: CustomFile | string | null
    thumbnail: CustomFile | string | null
}

const UploadVideoPage: React.FC<{ editVideo?: Video, id?: string }> = ({ editVideo, id }) => {
    console.log(id)
    const { translate } = useLocales()
    const { data } = useQuery(artistQueries().all.queryOptions({}))
    const { mutateAsync } = useMutation(videoQueries().create.mutationOptions())

    // video_name_is_required
    // video_stream_file_is_required
    // at_least_one_artist_required
    const VideoSchema = VideoValidators.createVideoInput.extend({
        stream: z.custom<CustomFile | string | null>((val) => val !== null && val !== '', {
            message: translate('video_stream_file_is_required'),
        }),
        thumbnail: z.custom<CustomFile | string | null>((val) => val !== null && val !== '', {
            message: translate('thumbnail_is_required'),
        }),
    })

    const defaultValues = {
        stream: editVideo?.thumbnail || undefined,
        title: editVideo?.title || '',
        artistIds: editVideo?.artists?.map(artist => artist.id) || []
    }

    const methods = useForm<FormValuesProps>({
        resolver: zodResolver(VideoSchema),
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
        await mutateAsync(formData, {
            onSuccess: (res) => {
                toast.success(res.message)
                reset()
            },
            onError: (err) => {
                toast.error(translate(err.message ?? 'unknown_error'))
            }
        })
    }

    const handleDropStream = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        const newFile = Object.assign(file, {
            preview: URL.createObjectURL(file),
        })
        if (file) setValue('stream', newFile, { shouldValidate: true })
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
                            <RHFTextField name='title' fieldLabel={translate('video_name')} placeholder={translate('enter_video_name')} />
                            {/* <RHFSingleDatePicker name='releaseDate' fieldLabel={translate('release_date')} placeholder={translate('select_release_date')} /> */}
                            {data && (
                                <RHFMultiSelect
                                    name='artistIds' fieldLabel={translate('artist_name')}
                                    options={data.map(artist => ({ label: artist.name, value: artist.id }))}
                                    placeholder={translate('select_artist')}
                                />
                            )}
                            <Button type="submit" size={'lg'} className='w-full' disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <Spinner className='size-6' />
                                ) : (
                                    translate('upload_video')
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className='w-full md:w-1/3'>
                    <Card>
                        <CardContent className="space-y-4">
                            <RHFUpload
                                name='stream'
                                maxSize={15728640}
                                accept={{ 'video/*': [] }}
                                onDrop={handleDropStream}
                                onDelete={() => setValue('stream', null, { shouldValidate: true })}
                                fieldLabel={translate('video_stream_file')}
                            />
                            <RHFUpload
                                name='thumbnail'
                                maxSize={3145728}
                                onDrop={handleDropThumbnail}
                                onDelete={() => setValue('thumbnail', null, { shouldValidate: true })}
                                fieldLabel={translate('video_thumbnail_image')}
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

export default UploadVideoPage