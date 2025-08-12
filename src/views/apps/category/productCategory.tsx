'use client'
import React, { SetStateAction, useEffect, useState } from 'react'
import { useGetAllCategoriesQuery } from '@/redux-store/services/category'
import ErrorMsg from '@/components/common/error-msg'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { MenuItem } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'

// prop type
type IPropType = {
  setCategory: React.Dispatch<SetStateAction<{ id: string; name: string }>>
  default_value?: {
    id: string
    name: string
  }
}

export default function ProductCategory({ setCategory, default_value }: IPropType) {
  const [open, setOpen] = React.useState<string>('')
  const { data: categories, isLoading, isError } = useGetAllCategoriesQuery()
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string
    name: string
  } | null>(default_value || null)

  useEffect(() => {
    if (default_value?.id && default_value?.name) {
      setCategory(default_value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // handleCategory
  const handleCategory = (value: string, title: string) => {
    setOpen(open === value ? '' : value)
    if (value && title) {
      setCategory({ id: value, name: title })
      setSelectedCategory({ id: value, name: title })
    }
  }

  // decide what to render
  let content = null

  if (isLoading) {
    content = <h2>Loading....</h2>
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg='There was an error' />
  }
  if (!isLoading && !isError && categories?.result.length === 0) {
    content = <ErrorMsg msg='No Category Found' />
  }

  if (!isLoading && !isError && categories?.success) {
    const categoryItems = categories.result

    content = (
      <>
        <div className='space-y-2'>
          <div className='flex items-center gap-2 is-full sm:is-auto'>
            <CustomTextField
              select
              value={selectedCategory?.id}
              onChange={e => {
                const selectedId = e.target.value
                const selectedItem = categoryItems.find(item => item._id === selectedId)
                handleCategory(selectedId, selectedItem?.name || '')
              }}
              className='w-full'
            >
              {categoryItems.map(item => (
                <MenuItem value={item._id}>{item.name}</MenuItem>
              ))}
            </CustomTextField>
          </div>
        </div>
      </>
    )
  }

  return (
    <div>
      <div>{content}</div>
    </div>
  )
}
