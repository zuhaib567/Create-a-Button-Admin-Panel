"use client";
import React, { useEffect } from 'react'
import { TagsInput } from 'react-tag-input-component'
import ErrorMsg from '@/components/common/error-msg'

type IPropType = {
  categoryChildren: string[]
  setCategoryChildren: React.Dispatch<React.SetStateAction<string[]>>
  default_value?: string[]
  error?: string
}

const CategoryChildren = ({ categoryChildren, setCategoryChildren, default_value, error }: IPropType) => {
  useEffect(() => {
    if (default_value) {
      setCategoryChildren(default_value)
    }
  }, [default_value, setCategoryChildren])

  return (
    <div className='mb-6'>
      <p className='mb-0 text-base'>Children</p>

      <TagsInput
        value={categoryChildren}
        onChange={setCategoryChildren}
        name='children'
        placeHolder='Enter children'
        classNames={{
          input: 'bg-backgroundPaper text-gray-600 rounded w-full',
          tag: 'bg-primary text-black dark:text-white px-2 py-1 rounded mr-1 mb-1',
        }}
      />

      <em className='text-xs text-gray-600 dark:text-gray-400'>Press enter to add new children</em>

      {error && <ErrorMsg msg={error} />}
    </div>
  )
}

export default CategoryChildren
