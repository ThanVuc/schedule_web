"use client"

import * as React from "react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"

interface TimestampRange {
  from?: number
  to?: number
}

interface DatePickerWithRangeProps {
  value?: TimestampRange
  onChange?: (date: TimestampRange | undefined) => void
  className?: string
  disabled?: boolean
}

const DatepickerWithRange = ({ value, onChange, className, disabled }: DatePickerWithRangeProps) => {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined)

  React.useEffect(() => {
    if (!value?.from) {
      setDate(undefined)
    } else {
      setDate({
        from: new Date(value.from),
        to: value.to ? new Date(value.to) : undefined,
      })
    }
  }, [value])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild
        disabled={disabled}
        >
          <Button
          disabled={disabled}
            variant="outline"
            className={cn(
              "w-full justify-center text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy")} -{" "}
                  {format(date.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 z-160" align="start">
          <Calendar
          disabled={disabled}
            initialFocus
            mode="range"
            selected={date}
            onSelect={(val) => {
              setDate(val)

              if (!val?.from) {
                onChange?.(undefined)
              } else {
                onChange?.({
                  from: val.from.getTime(),
                  to: val.to?.getTime(),
                })
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DatepickerWithRange
