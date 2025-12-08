import * as Yup from 'yup'
import { useCallback } from 'react'
import { RotatingLines } from 'react-loader-spinner'
import { useLocales } from '@/lib/locales'
// types
import type { CustomFile } from '@/components/upload'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// components
import { FormProvider, RHFTextField } from '@/components/hook-form'
import { RHFUpload } from '@/components/hook-form/RHFUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSnackbar } from '@/components/snackbar'
import { useCreateArtist } from '@/hooks/useApi'

type FormValuesProps = {
    thumbnail?: CustomFile | string
    name: string
}

const AddArtistPage: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar()
    const { translate } = useLocales()

    const createArtistMutation = useCreateArtist({
        onSuccess: (response) => {
            reset()
            enqueueSnackbar(translate(response.message), { variant: 'success' })
        },
        onError: (error) => {
            enqueueSnackbar(translate(error.message ?? 'unknown_error'), { variant: 'error' })
        }
    })

    const ArtistSchema: Yup.ObjectSchema<FormValuesProps> = Yup.object().shape({
        thumbnail: Yup.mixed<CustomFile | string>().optional(),
        name: Yup.string().required(translate('artist_name_is_required')),
    })

    const defaultValues = {
        thumbnail: undefined,
        name: '',
    }

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(ArtistSchema),
        defaultValues,
    })

    const {
        setValue,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = methods

    const onSubmit = async (data: FormValuesProps) => {
        const formData = new FormData()
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) formData.append(key, value as string | Blob)
        }
        createArtistMutation.mutate(formData)
    }

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
                            <RHFTextField name='name' fieldLabel={translate('artist_name')} placeholder={translate('enter_artist_name')} />
                            <Button type="submit" size={'lg'} className='w-full' disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <RotatingLines strokeColor="white" />
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