import { notifySuccess, notifyError } from '@/utils/toast'
import { useAddTemplateMutation, useEditTemplateMutation } from '@/redux-store/services/template'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'

const useTemplateSubmit = () => {
  const [templateImg, setTemplateImg] = useState<string>('')
  const [templateJson, setTemplateJson] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [templateChildren, setTemplateChildren] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [tags, setTags] = useState<string[]>([])
  const router = useRouter()
  // add
  const [addTemplate, { isLoading: addLoading }] = useAddTemplateMutation()
  // edit
  const [editTemplate, { isLoading: editLoading }] = useEditTemplateMutation()

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

  //handleSubmitTemplate
  const handleSubmitTemplate = async (data: any) => {
    try {
      if (!templateImg) {
        return notifyError('Image is required')
      }
      if (!data.name) {
        return notifyError('Name is required')
      }
      if (!templateJson) {
        return notifyError('Json file is required')
      }
      if (!data.category) {
        return notifyError('Category is required')
      }
      if (!tags.length) {
        return notifyError('Tags are required')
      }

      const template_data = {
        img: templateImg,
        json_file: templateJson,
        name: data?.name,
        tags: tags,
        category: data?.category
      }

      const res = await addTemplate(template_data)
      if ('error' in res) {
        if ('data' in res.error) {
          const errorData = res.error.data as { message?: string }
          if (typeof errorData.message === 'string') {
            return notifyError(errorData.message)
          }
        }
      } else {
        notifySuccess('Template added successfully')
        setIsSubmitted(true)
        reset()
        setTemplateChildren([])
        setTemplateImg('')
      }
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    }
  }

  //handle Submit edit Template
  const handleSubmitEditTemplate = async (data: any, id: string) => {
    try {
      const template_data = {
        img: templateImg,
        templateJson: templateJson,
        name: data?.name,
        tags: tags,
        category: data?.category
      }
      console.log('template_data', template_data)

      const res = await editTemplate({ id, data: template_data })
      if ('error' in res) {
        if ('data' in res.error) {
          const errorData = res.error.data as { message?: string }
          if (typeof errorData.message === 'string') {
            return notifyError(errorData.message)
          }
        }
      } else {
        notifySuccess('Template update successfully')
        router.push(`/${locale}/dashboard/template/template-list`)
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
    templateImg,
    setTemplateImg,
    templateJson,
    setTemplateJson,
    name,
    setName,
    templateChildren,
    setTemplateChildren,
    handleSubmitTemplate,
    error,
    isSubmitted,
    handleSubmitEditTemplate,
    tags,
    setTags
  }
}

export default useTemplateSubmit
