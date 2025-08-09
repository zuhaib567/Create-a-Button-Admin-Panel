'use client'
import React, { SetStateAction, useEffect, useState } from 'react'
import { useGetAllCategoriesQuery } from '@/redux-store/services/category'
import ErrorMsg from '@/components/common/error-msg'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { MenuItem } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'

// prop type
type IPropType = {
  setCategory: React.Dispatch<SetStateAction<{ name: string; id: string }>>
  setParent: React.Dispatch<SetStateAction<string>>
  setChildren: React.Dispatch<SetStateAction<string>>
  default_value?: {
    parent: string
    id: string
    children: string
  }
}

export default function ProductCategory({ setCategory, setParent, setChildren, default_value }: IPropType) {
  const [open, setOpen] = React.useState<string>('')
  const { data: categories, isError, isLoading } = useGetAllCategoriesQuery()
  const [selectedCategory, setSelectedCategory] = useState<string[]>(
    default_value ? [default_value.parent, default_value.children] : []
  )

  useEffect(() => {
    if (default_value?.parent && default_value.id && default_value.children) {
      const { id, parent, children } = default_value
      setCategory({ id: id, name: parent })
      setParent(parent)
      setChildren(children)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // handleCategory
  const handleCategory = (value: string, title: string) => {
    setOpen(open === value ? '' : value)
    if (value && title) {
      setCategory({ id: value, name: title })
      setParent(title)
    }
    if (title) {
      if (selectedCategory.includes(title)) {
        setSelectedCategory(title)
      }
    }
  }

  // handle sub category
  const handleSubCategory = (subCate: string) => {
    setChildren(subCate)
    if (selectedCategory.includes(subCate)) {
      setSelectedCategory(selectedCategory.filter(c => c !== subCate))
    } else {
      setSelectedCategory([...selectedCategory, subCate])
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
              value={selectedCategory[0]}
              onChange={e => handleCategory(e.target.value, "")}
              className='w-full'
            >
              {categoryItems.map(item => (
                <MenuItem value={item._id}>{item.parent}</MenuItem>
              ))}
            </CustomTextField>
          </div>
        </div>
      </>
    )
  }

  return (
    <div>
      <div className='flex flex-wrap gap-2 mb-3'>
        {selectedCategory.map((c, i) => (
          <span key={i} className='flex items-center gap-x-1 bg-primary text-xs text-white px-3 py-1 rounded-full'>
            {c}
            <b onClick={() => handleCategory('', c)}>×</b>
          </span>
        ))}
      </div>
        <div>{content}</div>
    </div>
  )
}
