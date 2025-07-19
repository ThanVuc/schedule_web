
"use client"

import * as React from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../../../components/ui/input-otp" 

type OTPCodeInputProps = {
  value: string
  onChange: (val: string) => void
  length?: number 
  className?: string
  containerClassName?: string
}

export const OTPCodeInput: React.FC<OTPCodeInputProps> = ({
  value,
  onChange,
  length = 6,
  className,
}) => {
  return (
   <InputOTP
        maxLength={length}
        value={value}
        onChange={onChange}
        inputMode="numeric"
        pattern="\d*"
      >
  <InputOTPGroup>
    {Array.from({ length }).map((_, index) => (
      <InputOTPSlot key={index} index={index} className={className} />
    ))}
  </InputOTPGroup>
</InputOTP>

  )
}
