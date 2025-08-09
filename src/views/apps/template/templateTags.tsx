import React, { useEffect } from 'react'
import { TagsInput } from 'react-tag-input-component'
import { UseFormRegister } from 'react-hook-form'
import ErrorMsg from '@/components/common/error-msg'
type IPropType = {
  tags: string[]
  setTags: React.Dispatch<React.SetStateAction<string[]>>
  default_value?: string[]
  error?: string
  register: UseFormRegister<any>
}
const TemplateTags = ({ tags, setTags, register, default_value, error }: IPropType) => {
  useEffect(() => {
    if (default_value) {
      setTags(default_value)
    }
  }, [default_value, setTags])
  console.log('default-value', default_value)
  return (
    <div className='mb-6'>
      <p className='mb-0 text-base'>Tags</p>
      <TagsInput
        {...register('tags')}
        value={tags}
        onChange={setTags}
        name='tags'
        placeHolder='enter tags'
        classNames={{
          input: 'bg-backgroundPaper text-gray-600 rounded w-full',
          tag: 'bg-primary text-black dark:text-white px-2 py-1 rounded mr-1 mb-1'
        }}
      />
      <em>press enter to add new tags</em>
      {error && <ErrorMsg msg={error} />}
    </div>
  )
}

export default TemplateTags
