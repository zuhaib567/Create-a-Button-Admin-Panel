'use client'
import React from 'react'
import CustomTextField from '@/@core/components/mui/TextField'
import ErrorMsg from '@/components/common/error-msg'
import { Button } from '@mui/material'
import useTemplateCategorySubmit from '@/hooks/useTemplateCategorySubmit'
import { useGetTemplateCategoryQuery } from '@/redux-store/services/templateCategory'

const EditTemplateCategory = ({ id }: { id: string }) => {
  const { data: categoryData, isError, isLoading } = useGetTemplateCategoryQuery(id)

  const { errors, register, handleSubmit, handleSubmitEditCategory } = useTemplateCategorySubmit()

  if (isError) {
    return <div className='text-red-500'>Error fetching category data</div>
  }

  if (isLoading) {
    return <div className='text-gray-500'>Loading...</div>
  }

  return (
    <div className='max-w-md mx-auto'>
      <form onSubmit={handleSubmit(values => handleSubmitEditCategory(values, id))}>
        <div className='mb-6 bg-backgroundPaper px-6 py-8 rounded-md'>
          <div className='mb-6'>
            <p className='mb-0 text-base'>Category Name</p>
            <CustomTextField
              {...register('name', {
                required: `Name is required!`
              })}
              className='input w-full h-[44px] rounded-md border border-gray6 text-base mt-3'
              type='text'
              name='name'
              placeholder='Enter category name'
              defaultValue={categoryData?.result?.name}
            />
            <ErrorMsg msg={(errors?.parent?.message as string) || ''} />
          </div>

          <div className='mb-6'>
            <p className='mb-0 text-base'>Description</p>
            <CustomTextField
              {...register('description', {
                required: false
              })}
              className='w-full py-3 resize-none'
              multiline
              minRows={4}
              type='text'
              name='description'
              placeholder='Description Here'
              defaultValue={categoryData?.result?.description}
            />
          </div>

          <Button type='submit' variant='contained' className='w-full'>
            Edit Template Category
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditTemplateCategory
