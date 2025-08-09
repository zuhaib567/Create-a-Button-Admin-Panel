'use client'

import React, { useEffect, useState } from 'react'
import CustomTextField from '@/@core/components/mui/TextField'

import { TextFieldProps } from '@mui/material'

type DebouncedInputType = {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }: DebouncedInputType) => {
  const [value, setValue] = useState<string | number>(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

export default DebouncedInput
