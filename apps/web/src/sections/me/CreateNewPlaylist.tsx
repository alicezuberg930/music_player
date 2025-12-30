// form
import { useForm } from 'react-hook-form'
import { useApi } from '@/hooks/useApi'
import { zodResolver } from '@hookform/resolvers/zod'
// components
import { FormProvider, RHFTextField } from '@/components/hook-form'
import { Button } from "@yukikaze/ui/button"
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@yukikaze/ui/dialog"
import RHFSwitch from '@/components/hook-form/RHFSwitch'
import { useSnackbar } from '@/components/snackbar'
import { useLocales } from '@/lib/locales'
import { Spinner } from '@yukikaze/ui/spinner'
import { PlaylistValidators } from '@yukikaze/validator'

type Props = {
    onOpenChange?: (open: boolean) => void
}

const CreateNewPlaylistDialog: React.FC<Props> = ({ onOpenChange }) => {
    const { enqueueSnackbar } = useSnackbar()
    const { translate } = useLocales()
    const { mutateAsync: createPlaylist } = useApi().useCreatePlaylist()

    // privacy_setting_required
    // playlist_title_required
    const defaultValues = {
        isPrivate: true,
        title: '',
        description: '',
    }

    const methods = useForm<PlaylistValidators.CreatePlaylistInput>({
        resolver: zodResolver(PlaylistValidators.createPlaylistInput),
        defaultValues,
    })

    const {
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = methods

    const onSubmit = async (data: PlaylistValidators.CreatePlaylistInput) => {
        await createPlaylist(data, {
            onSuccess: (response) => {
                onOpenChange?.(false)
                reset()
                enqueueSnackbar(response.message, { variant: 'success' })
            },
            onError: (error) => {
                enqueueSnackbar(translate(error.message ?? 'unknown_error'), { variant: 'error' })
            }
        })
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
                            <Spinner className='size-6' />
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