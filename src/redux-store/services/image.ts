import { ImageRes, ImageResponse, IAddImage, IAddImageResponse, IImageDeleteRes } from '@/types/apps/imageTypes';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuthRedirect } from '@/utils/baseQuery';

export const imageService = createApi({
  reducerPath: 'imageService',
  baseQuery: baseQueryWithAuthRedirect,
  // ✅ Declare tag types used in providesTags/invalidatesTags
  tagTypes: ['AllImage', 'getImage'],
  endpoints: builder => ({
    // Get all images
    getAllImages: builder.query<ImageResponse, void>({
      query: () => `/image/all`,
      providesTags: ['AllImage'],
      keepUnusedDataFor: 600
    }),
    // Add image
    addImage: builder.mutation<IAddImageResponse, IAddImage>({
      query: data => ({
        url: `/image/add`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['AllImage']
    }),
    // Delete image
    deleteImage: builder.mutation<IImageDeleteRes, string>({
      query: id => ({
        url: `/image/delete/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['AllImage', 'getImage']
    }),
    // Edit image
    editImage: builder.mutation<IAddImageResponse, { id: string; data: Partial<ImageRes> }>({
      query: ({ id, data }) => ({
        url: `/image/edit/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['AllImage', 'getImage']
    }),
    // Get single image
    getImage: builder.query<ImageRes, string>({
      query: id => `/image/get/${id}`,
      providesTags: ['getImage']
    })
  })
});

// Export hooks
export const {
  useGetAllImagesQuery,
  useAddImageMutation,
  useDeleteImageMutation,
  useEditImageMutation,
  useGetImageQuery
} = imageService;
