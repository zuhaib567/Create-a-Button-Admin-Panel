'use client'
import React from 'react'
import CustomTextField from '@/@core/components/mui/TextField'
import ErrorMsg from '@/components/common/error-msg'
import { Button } from '@mui/material'
import useTemplateSubmit from '@/hooks/useTemplateSubmit'
import { useGetTemplateQuery } from '@/redux-store/services/template'
import TemplateImgUpload from '../../globalImgUpload'
import TemplateTags from '../../templateTags'
import TemplateCategoryList from '../../templateCatagoryList'
import TemplateJsonFile from '../../globalJsonUpload'

const EditTemplate = ({ id }: { id: string }) => {
  const { data: templateData, isError, isLoading } = useGetTemplateQuery(id)

  const {
    errors,
    register,
    handleSubmit,
    setTemplateImg,
    templateImg,
    isSubmitted,
    handleSubmitEditTemplate,
    tags,
    setTags,
    error,
    setTemplateJson,
    templateJson
  } = useTemplateSubmit()

  if (isError) {
    return <div className='text-red-500'>Error fetching category data</div>
  }

  if (isLoading) {
    return <div className='text-gray-500'>Loading...</div>
  }

  return (
    <div className='max-w-md mx-auto'>
      <form onSubmit={handleSubmit(values => handleSubmitEditTemplate(values, id))}>
        <div className='mb-6 bg-backgroundPaper px-6 py-8 rounded-md'>
          <div className='col-span-12 lg:col-span-4'>
            <TemplateImgUpload
              isSubmitted={isSubmitted}
              setImage={setTemplateImg}
              default_img={templateData?.data?.templateThumbnail}
              image={templateImg}
            />

            <div className='mb-6'>
              <p className='mb-0 text-base'>Template Name</p>
              <CustomTextField
                {...register('name', {
                  required: `Name is required!`
                })}
                className='input w-full h-[44px] rounded-md border border-gray6 text-base mt-3'
                type='text'
                name='name'
                placeholder='Template Name Here'
                defaultValue={templateData?.data?.templateName}
              />
              <ErrorMsg msg={(errors?.name?.message as string) || ''} />
            </div>

            <TemplateJsonFile
              isSubmitted={isSubmitted}
              setJson={setTemplateJson}
              image={templateJson}
              default_json={templateData?.data?.templateJson}
            />
            <TemplateCategoryList register={register} default_value={templateData?.data?.templateCategoryId} />

            <TemplateTags
              register={register}
              tags={tags}
              setTags={setTags}
              error={error}
              default_value={templateData?.data?.templateTags}
            />

            <Button type='submit' variant='contained' className='w-full'>
              Edit Template
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditTemplate
