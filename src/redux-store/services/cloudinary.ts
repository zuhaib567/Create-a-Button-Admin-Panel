import {
  ICloudinaryDeleteResponse,
  ICloudinaryMultiplePostRes,
  ICloudinaryPostResponse
} from '@/types/apps/cloudinaryTypes';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuthRedirect } from '@/utils/baseQuery';

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
        };
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
});

export const {
  useDeleteCloudinaryImgMutation,
  useUploadImageMutation,
  useUploadImageMultipleMutation,
  useUploadJsonMutation
} = authApi;
