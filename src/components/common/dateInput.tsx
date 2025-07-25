"use client";

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function formatDate(date: Date | undefined, formatStr = "dd/MM/yyyy"): string {
  if (!date) return ""
  return format(date, formatStr)
}

function parseDate(input: string): Date | undefined {
  const parts = input.split("/")
  if (parts.length !== 3) return undefined

  const [day, month, year] = parts.map((p) => parseInt(p, 10))

  if (
    isNaN(day) ||
    isNaN(month) ||
    isNaN(year) ||
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12
  ) {
    return undefined
  }

  const date = new Date(year, month - 1, day)
  return isNaN(date.getTime()) ? undefined : date
}

interface DateInputProps {
  className?: string
  defaultValue?: string
  disabled?: boolean
  onChange?: (date: Date | undefined) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  label?: string | React.ReactNode
}

export function DateInput({
  defaultValue,
  onChange,
  onKeyDown,
  inputProps,
  className = "",
  disabled = false,
  label = "Subscription Date",
}: DateInputProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(
    defaultValue ? parseDate(defaultValue) : undefined
  )
  const [month, setMonth] = React.useState<Date | undefined>(date)
  const [value, setValue] = React.useState(formatDate(date))

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Label htmlFor="date" className="px-1">
        {label}
      </Label>
      <div className="relative flex gap-2">
        <Input
          {...inputProps}
          disabled={disabled}
          id="date"
          value={value}
          placeholder="dd/MM/yyyy"
          className="bg-background pr-10"
          onChange={(e) => {
            const input = e.target.value
            setValue(input)

            const parsed = parseDate(input)
            if (parsed) {
              setDate(parsed)
              setMonth(parsed)
            }
            if (onChange) {
              onChange(parsed)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
            if (onKeyDown) {
              onKeyDown(e)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              disabled={disabled}
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(selected) => {
                setDate(selected)
                setValue(formatDate(selected))
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
