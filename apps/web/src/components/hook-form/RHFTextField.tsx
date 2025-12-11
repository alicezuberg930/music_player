import { useFormContext, Controller } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@yukikaze/ui/field';
import { Input } from '@yukikaze/ui/input';

type RHFTextFieldProps = React.ComponentProps<"input"> & {
    name: string;
    fieldLabel: string
};

export default function RHFTextField({
    name,
    fieldLabel,
    ...other
}: RHFTextFieldProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error, invalid } }) => (
                <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel>
                    <Input
                        {...other}
                        {...field}
                        id={field.name}
                        aria-invalid={invalid}
                        autoComplete="off"
                    />
                    {invalid && <FieldError errors={[error]} className='ml-4' />}
                </Field>
            )}
        />
    );
}