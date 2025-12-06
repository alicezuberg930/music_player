import * as Yup from 'yup'
import { RotatingLines } from 'react-loader-spinner'
import { createPlaylist } from '@/lib/httpClient'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// components
import { FormProvider, RHFTextField } from '@/components/hook-form'
import { Button } from "@/components/ui/button"
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import RHFSwitch from '@/components/hook-form/RHFSwitch'
import { useSnackbar } from '@/components/snackbar'
import { useLocales } from '@/lib/locales'

type FormValuesProps = {
    isPrivate: boolean
    title: string
    description?: string
}

type Props = {
    onOpenChange?: (open: boolean) => void
}

const CreateNewPlaylistDialog: React.FC<Props> = ({ onOpenChange }) => {
    const { enqueueSnackbar } = useSnackbar()
    const { translate } = useLocales()

    const PlaylistSchema: Yup.ObjectSchema<FormValuesProps> = Yup.object().shape({
        isPrivate: Yup.boolean().required('privacy_setting_required'),
        title: Yup.string().required('playlist_title_required'),
        description: Yup.string().optional(),
    })

    const defaultValues = {
        isPrivate: true
    }

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(PlaylistSchema),
        defaultValues,
    })

    const {
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = methods

    const onSubmit = async (data: FormValuesProps) => {
        try {
            const formData = new FormData()
            for (const [key, value] of Object.entries(data)) {
                formData.append(key, value as string)
            }
            const response = await createPlaylist(formData)
            if (response.statusCode === 201) {
                onOpenChange?.(false)
                reset()
                enqueueSnackbar(response.message, { variant: 'success' })
            } else {
                enqueueSnackbar(translate(response.message ?? 'unknown_error'), { variant: 'error' })
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <DialogContent className="sm:max-w-md">
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader>
                    <DialogTitle>{translate('create_playlist')}</DialogTitle>
                    <DialogDescription>
                        {translate('enter_playlist_info')}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <RHFTextField name='title' fieldLabel={translate('title')} placeholder={translate('enter_playlist_title')} />
                    <RHFTextField name='description' fieldLabel={translate('description')} placeholder={translate('enter_playlist_description')} />
                    <RHFSwitch name="isPrivate" label={translate('private')} helperText={translate('private_mode')} />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">{translate('cancel')}</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <RotatingLines strokeColor="white" />
                        ) : (
                            translate('create_playlist')
                        )}
                    </Button>
                </DialogFooter>
            </FormProvider>
        </DialogContent>
    )
}

export default CreateNewPlaylistDialog