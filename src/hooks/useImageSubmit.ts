'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { notifyError, notifySuccess } from '@/utils/toast'
import { useAddImageMutation, useEditImageMutation } from '@/redux-store/services/image'
import { useRouter } from 'next/navigation'

const useImageSubmit = () => {
  const [editorImg, setEditorImg] = useState<string>('')
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const [addImage, {}] = useAddImageMutation()
  const [editImage, {}] = useEditImageMutation()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm()

  const router = useRouter()

  const handleSubmitImage = async (data: { image_name: string }) => {
    try {
      const image_data = {
        url: editorImg,
        name: data.image_name
      }

      const res = await addImage({ ...image_data })
      if ('error' in res) {
        if ('data' in res.error) {
          const errorData = res.error.data as { message?: string }
          if (typeof errorData.message === 'string') {
            return notifyError(errorData.message)
          }
        }
      } else {
        notifySuccess('Category added successfully')
        setIsSubmitted(true)
        reset()
        setEditorImg('')
      }
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    }
  }

  //handle Submit edit Image
  const handleSubmitEditImage = async (data: any, id: string) => {
    try {
      const image_data = {
        url: editorImg,
        name: data.image_name
      }

      const res = await editImage({ id, data: image_data })
      // console.log(res)
      if ('error' in res) {
        if ('data' in res.error) {
          const errorData = res.error.data as { message?: string }
          if (typeof errorData.message === 'string') {
            return notifyError(errorData.message)
          }
        }
      } else {
        notifySuccess('Category update successfully')
        router.push('/en/dashboard/images')
        setIsSubmitted(true)
        reset()
      }
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    }
  }
  return {
    errors,
    control,
    editorImg,
    setEditorImg,
    handleSubmit,
    register,
    handleSubmitImage,
    isSubmitted,
    handleSubmitEditImage
  }
}

export default useImageSubmit
