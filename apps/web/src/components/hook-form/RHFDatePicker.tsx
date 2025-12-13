import { useFormContext, Controller } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '@yukikaze/ui/field'
import { DayPicker, type DateRange, type DayPickerProps } from 'react-day-picker'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@yukikaze/ui/popover'
import { Button } from '@yukikaze/ui/button'
import { CalendarIcon } from '@yukikaze/ui/icons'
import 'react-day-picker/style.css'

dayjs.extend(customParseFormat)

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
                                selected={field.value ? dayjs(field.value, 'YYYY-MM-DD').toDate() : undefined}
                                onSelect={(day) => {
                                    if (day) {
                                        field.onChange(dayjs(day).format('YYYY-MM-DD'))
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
        if (start && !end) return `${dayjs(start).format('YYYY-MM-DD')} - ...`
        return start && end ? `${dayjs(start).format('YYYY-MM-DD')} - ${dayjs(end).format('YYYY-MM-DD')} ` : ''
    }

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error, invalid } }) => {
                const [start, end] = field.value || [undefined, undefined]
                const displayValue = displayValueStr(start, end)
                const selected: DateRange = {
                    from: start ? dayjs(start, 'YYYY-MM-DD').toDate() : undefined,
                    to: end ? dayjs(end, 'YYYY-MM-DD').toDate() : undefined
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
                                            const arr = [dayjs(range.from).format('YYYY-MM-DD'), dayjs(range.to).format('YYYY-MM-DD')]
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