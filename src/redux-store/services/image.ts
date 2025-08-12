import { ImageRes, ImageResponse, IAddImage, IAddImageResponse, IImageDeleteRes } from '@/types/apps/imageTypes'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Router from 'next/router' // ✅ for navigation

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/`,
  credentials: 'include',
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

export const imageService = createApi({
  reducerPath: 'imageService',
  baseQuery: baseQueryWithAuthRedirect,
  // ✅ Declare tag types used in providesTags/invalidatesTags
  tagTypes: ['AllImage', 'getImage'],
  endpoints: builder => ({
    // Get all categories
    getAllImages: builder.query<ImageResponse, void>({
      query: () => `/image/all`,
      providesTags: ['AllImage'],
      keepUnusedDataFor: 600 // cache data for 10 minutes
    }),

    // Add Image
    addImage: builder.mutation<IAddImageResponse, IAddImage>({
      query: data => ({
        url: `/image/add`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['AllImage']
    }),

    // Delete Image
    deleteImage: builder.mutation<IImageDeleteRes, string>({
      query: id => ({
        url: `/image/delete/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['AllImage', 'getImage']
    }),

    // Edit Image
    editImage: builder.mutation<IAddImageResponse, { id: string; data: Partial<ImageRes> }>({
      query: ({ id, data }) => ({
        url: `/image/edit/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['AllImage', 'getImage']
    }),

    // Get single Image
    getImage: builder.query<ImageRes, string>({
      query: id => `/image/get/${id}`,
      providesTags: ['getImage']
    })
  })
})

// Export hooks
export const {
  useGetAllImagesQuery,
  useAddImageMutation,
  useDeleteImageMutation,
  useEditImageMutation,
  useGetImageQuery
} = imageService
