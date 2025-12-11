import { FormProvider, RHFTextField } from '@/components/hook-form'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuthContext } from '@/lib/auth/useAuthContext'
import { Button } from '@yukikaze/ui/button'
import { Field, FieldGroup } from '@yukikaze/ui/field'

import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@yukikaze/ui/dialog'
import { useLocales } from '@/lib/locales'

interface FormValuesProps {
    email: string
    password: string
}

const SigninPage: React.FC = () => {
    const { signin } = useAuthContext()
    const { translate } = useLocales()

    const FormSchema = Yup.object().shape({
        email: Yup.string().required('Email is required'),
        password: Yup.string().required('Password is required'),
    })

    const defaultValues = useMemo(() => ({
        email: 'tien23851@gmail.com',
        password: '123456',
    }), [])

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(FormSchema),
        defaultValues,
    })

    const { handleSubmit } = methods

    const onSubmit = async (data: FormValuesProps) => {
        await signin(data.email, data.password)
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription>
                    {translate('sign_in_description')}
                </DialogDescription>
            </DialogHeader>

            <FieldGroup className="gap-4 my-6">
                <RHFTextField name="email" type="text" fieldLabel="Email" placeholder="Type your email" />

                <RHFTextField name="password" type="password" fieldLabel="Password" placeholder="Type your password" />
            </FieldGroup>

            <DialogFooter>
                <Field orientation="vertical">
                    <Field orientation={'horizontal'}>
                        <DialogClose asChild>
                            <Button type="reset" variant="outline" className="flex-auto">
                                Reset
                            </Button>
                        </DialogClose>
                        <Button type="submit" className="flex-auto">Submit</Button>
                    </Field>
                </Field>
            </DialogFooter>
        </FormProvider >
    )
}

export default SigninPage