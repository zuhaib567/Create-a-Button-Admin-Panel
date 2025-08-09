import { useUploadJsonMutation } from '@/redux-store/services/cloudinary'

const useUploadJson = () => {
  const [uploadJson, { data: uploadJsonData, isError, isLoading, error }] = useUploadJsonMutation()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('json_file', file)
      uploadJson(formData)
    }
  }

  return { handleImageUpload, uploadJsonData, isError, isLoading, error }
}

export default useUploadJson
