'use client'
import React from 'react'
import useCategorySubmit from '@/hooks/useCategorySubmit'
import CategoryTables from '../add/categoryTables'
import CategoryImgUpload from '../globalImgUpload'
import CategoryChildren from '../categoryChildren'
import { useGetCategoryQuery } from '@/redux-store/services/category'
import CustomTextField from '@/@core/components/mui/TextField'
import ErrorMsg from '@/components/common/error-msg'
import { Button } from '@mui/material'

const EditCategory = ({ id }: { id: string }) => {
  const { data: categoryData, isError, isLoading } = useGetCategoryQuery(id)

  const {
    errors,
    control,
    categoryChildren,
    setCategoryChildren,
    register,
    handleSubmit,
    setCategoryImg,
    categoryImg,
    error,
    isSubmitted,
    handleSubmitEditCategory
  } = useCategorySubmit()

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
          <CategoryImgUpload
            isSubmitted={isSubmitted}
            setImage={setCategoryImg}
            default_img={categoryData?.img}
            image={categoryImg}
          />

          <div className='mb-6'>
            <p className='mb-0 text-base'>Parent</p>
            <CustomTextField
              {...register('parent', {
                required: `Parent is required!`
              })}
              className='input w-full h-[44px] rounded-md border border-gray6 text-base mt-3'
              type='text'
              name='parent'
              placeholder='Name'
              defaultValue={categoryData?.parent}
            />
            <ErrorMsg msg={(errors?.parent?.message as string) || ''} />
          </div>

          <CategoryChildren
            categoryChildren={categoryChildren}
            setCategoryChildren={setCategoryChildren}
            error={error}
            default_value={categoryData?.children}
          />

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
              defaultValue={categoryData?.description}
            />
          </div>

          <Button type='submit' variant='contained' className='w-full'>
            Edit Category
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditCategory
