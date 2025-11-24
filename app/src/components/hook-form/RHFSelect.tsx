import { useFormContext, Controller } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { NativeSelect } from '../ui/native-select';
import { MultiSelect, type MultiSelectProps } from '../ui/multi-select';

type RHFSelectProps = React.ComponentProps<"select"> & {
    name: string;
    fieldLabel: string,
    children: React.ReactNode;
};

export function RHFSelect({
    name,
    fieldLabel,
    children,
    ...other
}: RHFSelectProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error, invalid } }) => (
                <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel>
                    <NativeSelect {...other} {...field} aria-invalid={invalid}>
                        {/* render NativeSelectOptions  */}
                        {children}
                    </NativeSelect>
                    {invalid && <FieldError errors={[error]} />}
                </Field>
            )}
        />
    );
}

type RHFMultiSelectProps = Omit<MultiSelectProps, 'onValueChange'> & {
    name: string;
    fieldLabel: string,
};

export function RHFMultiSelect({
    name,
    fieldLabel,
    children,
    ...other
}: RHFMultiSelectProps) {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error, invalid } }) => (
                <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel>
                    <MultiSelect
                        className='min-h-9'
                        aria-invalid={invalid}
                        {...other}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    />
                    {invalid && <FieldError errors={[error]} className='ml-4' />}
                </Field>
            )}
        />
    );
}
