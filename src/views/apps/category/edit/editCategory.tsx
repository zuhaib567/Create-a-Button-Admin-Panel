'use client'
import React from 'react'
import useCategorySubmit from '@/hooks/useCategorySubmit'
import CategoryTables from '../add/categoryTables'
import CategoryImgUpload from '../globalImgUpload'
import CategoryChildren from '../categoryChildren'
import { useGetCategoryQuery } from '@/redux-store/services/category'
import CustomTextField from '@/@core/components/mui/TextField'
import ErrorMsg from '@/components/common/error-msg'
import { Box, Button, Card, CardContent, Skeleton, Typography } from '@mui/material'
import Loader from '@/components/Loader'

const EditCategory = ({ id }: { id: string }) => {
  const { data: categoryData, isError, isLoading } = useGetCategoryQuery(id)

  const {
    errors,
    control,
    // categoryChildren,
    // setCategoryChildren,
    register,
    handleSubmit,
    // setCategoryImg,
    // categoryImg,
    // error,
    isSubmitted,
    handleSubmitEditCategory,
    editCategoryLoading
  } = useCategorySubmit()

  if (isLoading) {
    return (
      <Card className='pb-4 px-2'>
        <Skeleton variant='rounded' className='w-full mt-4' height={35} />
        <Skeleton variant='rounded' className='w-full mt-4' height={35} />
        <Skeleton variant='rounded' className='w-full mt-4' height={35} />
        <Skeleton variant='rounded' className='w-full mt-4' height={35} />
        <Skeleton variant='rounded' className='w-full mt-4' height={35} />
        <Skeleton variant='rounded' className='w-full mt-4' height={35} />
      </Card>
    )
  }

  if (isError) {
    return (
      <Card
        sx={{
          borderColor: 'error.main',
          backgroundColor: theme => theme.palette.error.light + '20'
        }}
        className='my-[20px] max-w-full py-[1px] px-[2px] border-l-[5px]'
      >
        <CardContent className='flex items-center h-[50px]'>
          <Box>
            <Typography variant='h6' color='error.main'>
              Network error — Please check your internet connection.
            </Typography>
            <Typography variant='body2' color='text.secondary'></Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='max-w-md mx-auto'>
      <form onSubmit={handleSubmit(values => handleSubmitEditCategory(values, id))}>
        <div className='mb-6 bg-backgroundPaper px-6 py-8 rounded-md'>
          {/* <CategoryImgUpload
            isSubmitted={isSubmitted}
            setImage={setCategoryImg}
            default_img={categoryData?.img}
            image={categoryImg}
          /> */}

          <div className='mb-6'>
            <p className='mb-0 text-base'>Product Category Name</p>
            <CustomTextField
              {...register('name', {
                required: `Category name is required!`
              })}
              className='input w-full h-[44px] rounded-md border border-gray6 text-base mt-3'
              type='text'
              name='name'
              placeholder='Enter category name'
              defaultValue={categoryData?.name}
            />
            <ErrorMsg msg={(errors?.name?.message as string) || ''} />
          </div>

          {/* <CategoryChildren
            categoryChildren={categoryChildren}
            setCategoryChildren={setCategoryChildren}
            error={error}
            default_value={categoryData?.children}
          /> */}

          {/* <div className='mb-6'>
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
          </div> */}

          <Button type='submit' variant='contained' className='w-full'>
            <Loader loading={editCategoryLoading}>Edit Product Category</Loader>
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditCategory
