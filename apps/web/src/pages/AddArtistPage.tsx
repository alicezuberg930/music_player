import z from 'zod'
import { useApi } from '@/hooks/useApi'
import { useCallback } from 'react'
import { useLocales } from '@/lib/locales'
import { ArtistValidators } from '@yukikaze/validator'
// types
import type { CustomFile } from '@/components/upload'
// form
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// components
import { FormProvider, RHFTextArea, RHFTextField } from '@/components/hook-form'
import { RHFUpload } from '@/components/hook-form/RHFUpload'
import { Button } from '@yukikaze/ui/button'
import { Card, CardContent } from '@yukikaze/ui/card'
import { Spinner } from "@yukikaze/ui/spinner"

type FormValuesProps = ArtistValidators.CreateArtistInput & {
    thumbnail?: CustomFile | string
}

const AddArtistPage: React.FC = () => {
    const { translate } = useLocales()

    const { mutateAsync: createArtist } = useApi().useCreateArtist()

    // artist_name_is_required
    const ArtistSchema = ArtistValidators.createArtistInput.extend({
        thumbnail: z.union([z.instanceof(File), z.string()]).optional(),
    })

    const defaultValues = {
        thumbnail: undefined,
        description: '',
        name: '',
    }

    const methods = useForm<FormValuesProps>({
        resolver: zodResolver(ArtistSchema),
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
        await createArtist(formData, {
            onSuccess: () => reset()
        })
    }

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
    console.log(isSubmitting)
    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col md:flex-row gap-6 mt-6'>
                <div className='w-full md:w-2/3'>
                    <Card>
                        <CardContent className="space-y-4">
                            <RHFTextField name='name' fieldLabel={translate('artist_name')} placeholder={translate('enter_artist_name')} />
                            <RHFTextArea rows={10} name='description' fieldLabel={translate('description')} placeholder={translate('enter_artist_description')} />
                            <Button type="submit" size={'lg'} className='w-full' disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <Spinner className='size-6' />
                                ) : (
                                    translate('add_artist')
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className='w-full md:w-1/3'>
                    <Card>
                        <CardContent className="space-y-4">
                            <RHFUpload
                                name='thumbnail'
                                maxSize={3145728}
                                onDrop={handleDropThumbnail}
                                onDelete={() => setValue('thumbnail', undefined, { shouldValidate: true })}
                                fieldLabel={translate('artist_avatar')}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </FormProvider>
    )
}

export default AddArtistPage