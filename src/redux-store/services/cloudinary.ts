import {
  ICloudinaryDeleteResponse,
  ICloudinaryMultiplePostRes,
  ICloudinaryPostResponse
} from '@/types/apps/cloudinaryTypes'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Router from 'next/router' // ✅ for navigation

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/`,
  timeout: 12000,
  prepareHeaders: headers => {
    const token = localStorage.getItem('token')
    if (!!token) {
      headers.set('Authorization', `Bearer ${JSON.parse(token)}`)
    }
    return headers
  }
})

// ✅ Wrapper for handling expired token
const baseQueryWithAuthRedirect: typeof baseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    localStorage.removeItem('token')
    Router.replace('/login')
  }
  return result
}

export const authApi = createApi({
  reducerPath: 'categoryService',
  baseQuery: baseQueryWithAuthRedirect,
  endpoints: builder => ({
    uploadImage: builder.mutation<ICloudinaryPostResponse, FormData>({
      query: data => ({
        url: '/cloudinary/add-img',
        method: 'POST',
        body: data
      })
    }),
    uploadImageMultiple: builder.mutation<ICloudinaryMultiplePostRes, FormData>({
      query: data => ({
        url: '/cloudinary/add-multiple-img',
        method: 'POST',
        body: data
      })
    }),
    deleteCloudinaryImg: builder.mutation<ICloudinaryDeleteResponse, { folder_name: string; id: string }>({
      query({ folder_name, id }) {
        return {
          url: `/cloudinary/img-delete?folder_name=${folder_name}&id=${id}`,
          method: 'DELETE'
        }
      }
    }),
    uploadJson: builder.mutation<ICloudinaryPostResponse, FormData>({
      query: data => ({
        url: '/cloudinary/add-json',
        method: 'POST',
        body: data
      })
    })
  })
})

export const {
  useDeleteCloudinaryImgMutation,
  useUploadImageMutation,
  useUploadImageMultipleMutation,
  useUploadJsonMutation
} = authApi
