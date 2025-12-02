import * as Yup from 'yup'
import { useState } from 'react'
import { RotatingLines } from 'react-loader-spinner'
import { createPlaylist } from '@/lib/httpClient'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// components
import { FormProvider, RHFTextField } from '@/components/hook-form'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import RHFSwitch from '@/components/hook-form/RHFSwitch'
import { useSnackbar } from '@/components/snackbar'

type FormValuesProps = {
    isPrivate: boolean
    title: string
    description?: string
}

const CreateNewPlaylistDialog: React.FC<{ triggerElement: React.ReactNode }> = ({ triggerElement }) => {
    const { enqueueSnackbar } = useSnackbar()
    const [open, setOpen] = useState(false)

    const PlaylistSchema: Yup.ObjectSchema<FormValuesProps> = Yup.object().shape({
        isPrivate: Yup.boolean().required('Privacy setting is required'),
        title: Yup.string().required('Title is required'),
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
            Object.entries(data).forEach(([key, value]) => formData.append(key, value as string))
            const response = await createPlaylist(formData)
            if (response?.statusCode && response?.statusCode === 201) {
                setOpen(false)
                reset()
                enqueueSnackbar(response.message, { variant: 'success' })
            } else {
                enqueueSnackbar('Có lỗi xảy ra khi tạo danh sách phát', { variant: 'error' })
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerElement}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Tạo danh sách phát</DialogTitle>
                        <DialogDescription>
                            Nhập thông tin danh sách phát của bạn bên dưới.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <RHFTextField name='title' fieldLabel='Tiêu đề' placeholder='Nhập tiêu đề' />
                        <RHFTextField name='description' fieldLabel='Mô tả' placeholder='Nhập mô tả' />
                        <RHFSwitch name="isPrivate" label="Riêng tư" helperText="Đặt chế độ riêng tư" />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Hủy</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <RotatingLines strokeColor="white" />
                            ) : (
                                'Tạo'
                            )}
                        </Button>
                    </DialogFooter>
                </FormProvider>
            </DialogContent>
        </Dialog >
    )
}

export default CreateNewPlaylistDialog