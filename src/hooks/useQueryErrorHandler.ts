import { toast } from 'react-toastify'

export const useQueryErrorHandler = () => {
  const handleQueryError = (error: any) => {
    if (`status` in error) {
      const serverMessage = error.data ? error.data.message : null

      switch (error.status) {
        case 400 || 402: {
          toast.error(serverMessage ?? `Bad Request.`)
          break
        }
        case 401: {
          toast.error(serverMessage ?? `Unauthorized.`)
          break
        }
        case 403: {
          toast.error(serverMessage ?? `Bad Request.`)
          break
        }
        case 500: {
          toast.error(serverMessage ?? `Interval Server Error.`)
          break
        }
        case 502: {
          toast.error(serverMessage ?? `Bad Gateway.`)
          break
        }
        case `FETCH_ERROR`: {
          toast.error(serverMessage ?? `Server Not Responding.`)
          break
        }
        default: {
          toast.error(serverMessage ?? `Something Is Not Right.`)
        }
      }
    } else {
      toast.error(error.message ?? `Something Unexpected Happened.`)
    }
  }
  return { handleQueryError }
}
