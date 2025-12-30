import { FormProvider, RHFTextField } from '@/components/hook-form'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthContext } from '@/lib/auth/useAuthContext'
import { Button } from '@yukikaze/ui/button'
import { Field, FieldGroup } from '@yukikaze/ui/field'
import { AuthValidators } from "@yukikaze/validator"
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@yukikaze/ui/dialog'
import { useLocales } from '@/lib/locales'

const SignupPage: React.FC = () => {
    const { signup } = useAuthContext()
    const { translate } = useLocales()

    const defaultValues = useMemo(() => ({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
    }), [])

    const methods = useForm<AuthValidators.RegisterInput>({
        resolver: zodResolver(AuthValidators.registerInput),
        defaultValues,
    })

    const { handleSubmit } = methods

    const onSubmit = async (data: AuthValidators.RegisterInput) => {
        await signup(data)
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription>
                    {translate('sign_up_description')}
                </DialogDescription>
            </DialogHeader>

            <FieldGroup className="gap-4 my-6">
                <RHFTextField name="fullname" type="text" fieldLabel="Fullname" placeholder="Type your full name" />

                <RHFTextField name="email" type="text" fieldLabel="Email" placeholder="Type your email" />

                <RHFTextField name="password" type="password" fieldLabel="Password" placeholder="Type your password" />

                <RHFTextField name="confirmPassword" type="password" fieldLabel="Confirm password" placeholder="Confirm your password" />
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
        </FormProvider>
    )
}

export default SignupPage