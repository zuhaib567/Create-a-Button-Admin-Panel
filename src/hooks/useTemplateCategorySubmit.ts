import { notifySuccess, notifyError } from '@/utils/toast'
import {
  useAddTemplateCategoryMutation,
  useEditTemplateCategoryMutation
} from '@/redux-store/services/templateCategory'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'

const useTemplateCategorySubmit = () => {
  const [name, setName] = useState<string>('')
  // const [description, setDescription] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const router = useRouter()
  // add
  const [addTemplateCategory, { isLoading: addTemplateCategoryLoading }] = useAddTemplateCategoryMutation()
  // edit
  const [editTemplateCategory, { isLoading: editTemplateCategoryLoading }] = useEditTemplateCategoryMutation()

  // react hook form
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset
  } = useForm()

  const { lang: locale } = useParams()

  //handleSubmitCategory
  const handleSubmitCategory = async (data: any) => {
    try {
      const template_category_data = {
        name: data.name
        // description: data.description
      }

      if (template_category_data.name.trim() === '') {
        notifyError('Name is required')
        return
      } // else if (data.description.trim() === '') {
      //   notifyError('Description is required')
      //   return
      // }

      const res = await addTemplateCategory(template_category_data)
      if ('error' in res) {
        if ('data' in res.error!) {
          const errorData = res.error.data as { message?: string }
          if (typeof errorData.message === 'string') {
            notifyError(errorData.message)
            return
          }
        }
        notifyError('Something went wrong')
      } else {
        notifySuccess('Category added successfully')
        setIsSubmitted(true)
        reset()
      }
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    }
  }

  //handle Submit edit Category
  const handleSubmitEditCategory = async (data: any, id: string) => {
    try {
      const category_data = {
        name: data.name
        // description: data.description
      }

      const res = await editTemplateCategory({ id, data: category_data })

      if ('error' in res) {
        if ('data' in res.error!) {
          const errorData = res.error.data as { message?: string }
          if (typeof errorData.message === 'string') {
            notifyError(errorData.message)
            return
          }
        }
        notifyError('Something went wrong')
      } else {
        notifySuccess('Category updated successfully')
        router.push(`/${locale}/dashboard/template/template-category`)
        setIsSubmitted(true)
        reset()
      }
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    }
  }

  return {
    register,
    handleSubmit,
    setValue,
    errors,
    control,
    name,
    setName,
    // description,
    // setDescription,
    handleSubmitCategory,
    addTemplateCategoryLoading,
    error,
    isSubmitted,
    handleSubmitEditCategory,
    editTemplateCategoryLoading
  }
}

export default useTemplateCategorySubmit
