import { FormProvider, RHFTextField } from '@/components/hook-form'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthContext } from '@/lib/auth/useAuthContext'
import { Button } from '@yukikaze/ui/button'
import { Field, FieldGroup } from '@yukikaze/ui/field'
import { AuthValidators } from "@yukikaze/validator"
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@yukikaze/ui/dialog'
import { useLocales } from '@/lib/locales'
import { Spinner } from '@yukikaze/ui/spinner'

const SigninPage: React.FC = () => {
    const { signIn, signInWithProvider } = useAuthContext()
    const { translate } = useLocales()

    const defaultValues = useMemo(() => ({
        email: 'tien23851@gmail.com',
        password: 'V1nht1en1411@',
    }), [])

    const methods = useForm<AuthValidators.SignInInput>({
        resolver: zodResolver(AuthValidators.signInInput),
        defaultValues,
    })

    const { handleSubmit, formState: { isSubmitting } } = methods

    const onSubmit = async (data: AuthValidators.SignInInput) => await signIn(data)

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

            <div className='flex justify-around gap-4 mb-4'>
                <Button type='button'
                    className='flex-auto bg-white hover:bg-gray-200/50 drop-shadow-2xl shadow-gray-900 text-black'
                    onClick={() => signInWithProvider('google')}
                >
                    <img src="./assets/providers/google-icon.svg" width={24} height={24} />
                    Google
                </Button>
                <Button type='button'
                    className='flex-auto bg-white hover:bg-gray-200/50 drop-shadow-2xl shadow-gray-900 text-black'
                    onClick={() => signInWithProvider('facebook')}
                >
                    <img src="./assets/providers/facebook-icon.svg" width={24} height={24} />
                    Facebook
                </Button>
            </div>

            <DialogFooter>
                <Field orientation="vertical">
                    <Field orientation={'horizontal'}>
                        {/* <DialogClose asChild>
                            <Button type="reset" variant="outline" className="flex-auto">
                                Reset
                            </Button>
                        </DialogClose> */}
                        <Button type="submit" className="flex-auto" disabled={isSubmitting}>
                            {isSubmitting ? <Spinner className='size-6' /> : <>{translate('login')}</>}
                        </Button>
                    </Field>
                </Field>
            </DialogFooter>
        </FormProvider >
    )
}

export default SigninPage