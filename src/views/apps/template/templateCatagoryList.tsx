import React, { useEffect, useState } from 'react'
import { UseFormRegister } from 'react-hook-form'

import { useGetAllTemplateCategoriesQuery } from '@/redux-store/services/templateCategory'
import CustomTextField from '@core/components/mui/TextField'
import { MenuItem } from '@mui/material'

const TemplateCategoryList = ({
  register,
  default_value
}: {
  register: UseFormRegister<any>
  default_value?: string
}) => {
  const { data: categories, isLoading } = useGetAllTemplateCategoriesQuery()
  const [categoryList, setCategoryList] = useState<any[]>([])

  useEffect(() => {
    if (categories?.result) {
      setCategoryList(categories.result)
    }
  }, [categories])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='mb-6'>
      <p className='mb-0 text-base'>Category</p>
      <CustomTextField
        select
        {...register('category')}
        className='w-full h-[44px] py-2 rounded-md'
        defaultValue={default_value}
      >
        <MenuItem value={'Select Category'} disabled>
          Select Category
        </MenuItem>
        {categoryList.map(category => (
          <MenuItem key={category._id} selected={default_value === category._id} value={category._id}>
            {category.name}
          </MenuItem>
        ))}
      </CustomTextField>
    </div>
  )
}

export default TemplateCategoryList
