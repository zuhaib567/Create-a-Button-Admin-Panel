'use client'
import React from 'react'
import useImageSubmit from '@/hooks/useImageSubmit'
import EditorShapeUpload from '../globalImgUpload'
import { useGetImageQuery } from '@/redux-store/services/image'
import CustomTextField from '@/@core/components/mui/TextField'
import ErrorMsg from '@/components/common/error-msg'
import { Button } from '@mui/material'

const EditShape = ({ id }: { id: string }) => {
  const { data: imageData, isError, isLoading } = useGetImageQuery(id)

  const { errors, control, editorImg, setEditorImg, handleSubmit, register, isSubmitted, handleSubmitEditImage } =
    useImageSubmit()

  if (isError) {
    return <div className='text-red-500'>Error fetching category data</div>
  }

  if (isLoading) {
    return <div className='text-gray-500'>Loading...</div>
  }

  return (
    <div className='max-w-md mx-auto'>
      <form onSubmit={handleSubmit(values => handleSubmitEditImage(values, id))}>
        <div className='mb-6 bg-backgroundPaper px-6 py-8 rounded-md'>
          <EditorShapeUpload
            isSubmitted={isSubmitted}
            setImage={setEditorImg}
            image={editorImg}
            default_img={imageData?.url}
          />

          <div className='mb-6'>
            <p className='mb-0 text-base'>Image Name</p>
            <CustomTextField
              {...register('shape_name', {
                required: `Shape name is required!`
              })}
              className='input w-full h-[44px] rounded-md border border-gray6 text-base mt-3'
              type='text'
              name='image_name'
              placeholder='Enter image name'
              defaultValue={imageData?.name}
            />
            <ErrorMsg msg={(errors?.parent?.message as string) || ''} />
          </div>

          <Button type='submit' variant='contained' className='w-full'>
            Edit Shape
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditShape
