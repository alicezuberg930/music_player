import { useFormContext, Controller } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { DayPicker, type DateRange, type DayPickerProps } from 'react-day-picker'
import { format, parse } from 'date-fns'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { CalendarIcon } from 'lucide-react'
import 'react-day-picker/style.css'

type RHFDatePickerProps = Omit<DayPickerProps, 'mode'> & {
    name: string
    fieldLabel: string
    placeholder: string
}

export function RHFSingleDatePicker({
    name,
    fieldLabel,
    placeholder,
    ...other
}: RHFDatePickerProps) {
    const { control } = useFormContext()
    const [open, setOpen] = useState(false)

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error, invalid } }) => (
                <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant='outline'
                                className={`justify-start text-left font-normal w-full ${invalid ? 'border-red-500' : ''}`}
                                onClick={() => setOpen(true)}
                            >
                                <CalendarIcon className='mr-2 h-4 w-4 opacity-50' />
                                {field.value ? (
                                    field.value
                                ) : (
                                    <span className='text-muted-foreground'>{placeholder}</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='min-w-fit' align='start'>
                            <DayPicker
                                {...other}
                                navLayout='around'
                                mode='single'
                                selected={field.value ? parse(field.value, 'MM/dd/yyyy', new Date()) : undefined}
                                onSelect={(day) => {
                                    if (day) {
                                        field.onChange(format(day, 'MM/dd/yyyy'))
                                        setOpen(false)
                                    }
                                }}
                                defaultMonth={field.value}
                            />
                        </PopoverContent>
                    </Popover>
                    {invalid && <FieldError errors={[error]} />}
                </Field>
            )}
        />
    )
}

export function RHFRangeDatePicker({
    name,
    fieldLabel,
    placeholder,
    ...other
}: RHFDatePickerProps) {
    const { control } = useFormContext()
    const [open, setOpen] = useState(false)

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error, invalid } }) => {
                const [start, end] = field.value || [undefined, undefined]
                const displayValue = start && end
                    ? `${format(start, 'MM/dd/yyyy')} - ${format(end, 'MM/dd/yyyy')}` : start
                        ? `${format(start, 'MM/dd/yyyy')} - ...` : ''
                const selected: DateRange = {
                    from: start ? parse(start, 'MM/dd/yyyy', new Date()) : undefined,
                    to: end ? parse(end, 'MM/dd/yyyy', new Date()) : undefined
                }
                return (
                    <Field data-invalid={invalid}>
                        <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant='outline'
                                    className={`justify-start text-left font-normal w-full ${invalid ? 'border-red-500' : ''}`}
                                    onClick={() => setOpen(true)}
                                >
                                    <CalendarIcon className='mr-2 h-4 w-4 opacity-50' />
                                    {displayValue ? (
                                        displayValue
                                    ) : (
                                        <span className='text-muted-foreground'>{placeholder}</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='min-w-fit' align='start'>
                                <DayPicker
                                    {...other}
                                    mode='range'
                                    selected={selected}
                                    onSelect={(range) => {
                                        if (range?.from && range.to) {
                                            const arr = [format(range.from, 'MM/dd/yyyy'), format(range.to, 'MM/dd/yyyy')]
                                            field.onChange(arr)
                                        }
                                    }}
                                    defaultMonth={selected?.from}
                                    numberOfMonths={2}
                                />
                                <Button variant={'outline'} onClick={() => setOpen(false)}>OK</Button>
                            </PopoverContent>
                        </Popover>
                        {invalid && <FieldError errors={[error]} />}
                    </Field>
                )
            }}
        />
    )
}