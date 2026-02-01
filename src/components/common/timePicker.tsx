'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TimePickerProps {
  value?: number
  title: string
  disabled?: boolean
  onChange?: (value: number) => void
}

const TimePicker = ({ value, title, onChange, disabled }: TimePickerProps) => {
  const date = value ? new Date(value) : null

  const timeValue = date
    ? date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    : ''

  const ampm =
    date && date.getHours() >= 12 ? 'PM' : 'AM'

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex gap-4'>
        <div className='flex border-2 rounded-md w-full h-10 overflow-hidden'>
          <Label className='px-2 border-r-2 bg-gray-900 flex items-center'>
            {title}
          </Label>

          <Input
            type='time'
            step={60}
            disabled={disabled}
            value={timeValue}
            onChange={e => {
              const [hour, minute] = e.target.value.split(':').map(Number)
              const now = new Date()
              now.setHours(hour, minute, 0, 0)
              onChange?.(now.getTime())
            }}
            className='
              flex
              items-center
              justify-center
              border-none 
              bg-transparent
              h-full
              py-0
              leading-none
              focus-visible:ring-0 
              focus-visible:ring-offset-0
            '
          />
          <span className='px-3 flex items-center border-l-2 text-sm text-muted-foreground'>
            {timeValue ? ampm : '--'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TimePicker
