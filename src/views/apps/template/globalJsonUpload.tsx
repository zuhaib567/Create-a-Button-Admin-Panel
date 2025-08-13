import React, { useEffect } from 'react'
import Loading from '@/components/common/loading'
import useUploadJson from '@/hooks/useUploadJson'

// prop type
type IPropType = {
  setJson: React.Dispatch<React.SetStateAction<string>>
  isSubmitted: boolean
  default_json?: string
  image?: string
  setIsSubmitted?: React.Dispatch<React.SetStateAction<boolean>>
}

const GlobalJsonUpload = ({ setJson, isSubmitted, default_json, image, setIsSubmitted }: IPropType) => {
  const { handleImageUpload, uploadJsonData, isError, isLoading } = useUploadJson()
  const showDefaultImage = !uploadJsonData && !isLoading && !isError && default_json

  const upload_json = isLoading ? (
    <Loading loading={isLoading} spinner='scale' />
  ) : uploadJsonData?.data.url ? (
    <div className='text-center'>
      <p className='text-sm text-gray-600'>{uploadJsonData.data.id}.json</p>
    </div>
  ) : null

  // set upload image
  useEffect(() => {
    if (isLoading && setIsSubmitted) {
      setIsSubmitted(false)
    }
  }, [isLoading, setIsSubmitted])

  useEffect(() => {
    if (uploadJsonData && !isError && !isLoading) {
      setJson(uploadJsonData.data.url)
    } else if (default_json) {
      setJson(default_json)
    }
  }, [default_json, uploadJsonData, isError, isLoading, setJson])

  return (
    <div className='mb-6'>
      <p className='mb-2 text-base'>Upload Json File</p>

      <div className=''>
        <input
          onChange={handleImageUpload}
          type='file'
          name='json_file'
          id='json_file'
          className='hidden'
          accept='.json'
        />
        <label
          htmlFor='json_file'
          className='text-tiny w-full inline-block py-1 px-4 rounded-md border border-gray6 text-center hover:cursor-pointer hover:bg-theme hover:text-white hover:border-theme transition'
        >
          Upload Json File
        </label>
      </div>
      <div className='text-center'>
        <p className='text-sm text-gray-600 w-96 break-words text-start'>{default_json}</p>
        {isSubmitted ? (
          <div className='text-center'>
            <span className='text-tiny text-center w-full inline-block mb-3'>(Only json file will be accepted)</span>
          </div>
        ) : (
          upload_json
        )}
      </div>
    </div>
  )
}

export default GlobalJsonUpload
