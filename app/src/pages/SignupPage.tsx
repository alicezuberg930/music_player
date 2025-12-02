import { FormProvider, RHFTextField } from '@/components/hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup } from '@/components/ui/field'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Typography } from '@/components/ui/typography'
import { useAuthContext } from '@/lib/auth/useAuthContext'
import { Link } from "react-router-dom"
import { paths } from '@/lib/route/paths'

interface FormValuesProps {
    fullname: string
    email: string
    password: string
    confirmPassword: string
}

const SignupPage: React.FC = () => {
    const { signup } = useAuthContext()

    const FormSchema = Yup.object().shape({
        fullname: Yup.string().required('Full name is required'),
        email: Yup.string().required('Email is required'),
        password: Yup.string().required('Password is required'),
        confirmPassword: Yup.string().required('Confirm password is required'),
    })

    const defaultValues = useMemo(
        () => ({
            fullname: '',
            email: '',
            password: '',
            confirmPassword: '',
        }),
        [],
    )

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(FormSchema),
        defaultValues,
    })

    const { handleSubmit } = methods

    const onSubmit = async (data: FormValuesProps) => {
        await signup(data.fullname, data.email, data.password)
    }

    return (
        <div className="mx-auto max-w-md h-screen content-center px-2">
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Card className="w-full sm:max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>
                            <Typography variant={'h5'}>Đăng ký</Typography>
                        </CardTitle>
                        <CardDescription>Đăng ký tài khoản để trải nghiệm thêm tính năng của Vina Smartlite.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup className="gap-4">
                            <RHFTextField name="fullname" type="text" fieldLabel="Fullname" placeholder="Type your full name" />

                            <RHFTextField name="email" type="text" fieldLabel="Email" placeholder="Type your email" />

                            <RHFTextField name="password" type="password" fieldLabel="Password" placeholder="Type your password" />

                            <RHFTextField name="confirmPassword" type="password" fieldLabel="Confirm password" placeholder="Confirm your password" />
                        </FieldGroup>
                    </CardContent>
                    <CardFooter>
                        <Field orientation="vertical">
                            <Field orientation={'horizontal'}>
                                <Button type="reset" variant="outline" className="flex-auto">
                                    Reset
                                </Button>
                                <Button type="submit" className="flex-auto">Submit</Button>
                            </Field>
                            <Typography className="text-center">
                                Bạn đã có tài khoản?{' '}
                                <Link to={paths.SIGNIN} className="text-primary hover:underline">
                                    Đăng nhập
                                </Link>
                            </Typography>
                        </Field>
                    </CardFooter>
                </Card>
            </FormProvider>
        </div>
    )
}

export default SignupPage