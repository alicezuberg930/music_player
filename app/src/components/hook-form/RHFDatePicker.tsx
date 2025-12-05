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
                                captionLayout='dropdown'
                                startMonth={new Date(1900, 0)}
                                endMonth={new Date(new Date().getFullYear(), 0)}
                                mode='single'
                                selected={field.value ? parse(field.value, 'yyyy-MM-dd', new Date()) : undefined}
                                onSelect={(day) => {
                                    if (day) {
                                        field.onChange(format(day, 'yyyy-MM-dd'))
                                        setOpen(false)
                                    }
                                }}
                                defaultMonth={field.value}
                            />
                        </PopoverContent>
                    </Popover>
                    {invalid && <FieldError errors={[error]} className='ml-4' />}
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

    const displayValueStr = (start?: string, end?: string) => {
        if (start && !end) return `${format(start, 'yyyy-MM-dd')} - ...`
        return start && end ? `${format(start, 'yyyy-MM-dd')} - ${format(end, 'yyyy-MM-dd')} ` : ''
    }

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error, invalid } }) => {
                const [start, end] = field.value || [undefined, undefined]
                const displayValue = displayValueStr(start, end)
                const selected: DateRange = {
                    from: start ? parse(start, 'yyyy-MM-dd', new Date()) : undefined,
                    to: end ? parse(end, 'yyyy-MM-dd', new Date()) : undefined
                }
                return (
                    <Field data-invalid={invalid}>
                        <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant='outline'
                                    className={`justify - start text - left font - normal w - full ${invalid ? 'border-red-500' : ''} `}
                                    onClick={() => setOpen(true)}
                                >
                                    <CalendarIcon className='mr-2 h-4 w-4 opacity-50' />
                                    {displayValue.length ? (
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
                                            const arr = [format(range.from, 'yyyy-MM-dd'), format(range.to, 'yyyy-MM-dd')]
                                            field.onChange(arr)
                                        }
                                    }}
                                    defaultMonth={selected?.from}
                                    numberOfMonths={2}
                                />
                                <Button variant={'outline'} onClick={() => setOpen(false)}>OK</Button>
                            </PopoverContent>
                        </Popover>
                        {invalid && <FieldError errors={[error]} className='ml-4' />}
                    </Field>
                )
            }}
        />
    )
}