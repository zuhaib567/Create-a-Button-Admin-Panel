import {
  CategoryRes,
  CategoryResponse,
  IAddCategory,
  IAddCategoryResponse,
  ICategoryDeleteRes
} from '@/types/apps/categoryTypes';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuthRedirect } from '@/utils/baseQuery';

export const categoryService = createApi({
  reducerPath: 'categoryService',
  baseQuery: baseQueryWithAuthRedirect,
  // ✅ Declare tag types used in providesTags/invalidatesTags
  tagTypes: ['AllCategory', 'getCategory'],
  endpoints: builder => ({
    // Get all categories
    getAllCategories: builder.query<CategoryResponse, void>({
      query: () => `/category/all`,
      providesTags: ['AllCategory'],
      keepUnusedDataFor: 600
    }),
    // Add category
    addCategory: builder.mutation<IAddCategoryResponse, IAddCategory>({
      query: data => ({
        url: `/category/add`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['AllCategory']
    }),
    // Delete category
    deleteCategory: builder.mutation<ICategoryDeleteRes, string>({
      query: id => ({
        url: `/category/delete/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['AllCategory', 'getCategory']
    }),
    // Edit category
    editCategory: builder.mutation<IAddCategoryResponse, { id: string; data: Partial<CategoryRes> }>({
      query: ({ id, data }) => ({
        url: `/category/edit/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['AllCategory', 'getCategory']
    }),
    // Get single category
    getCategory: builder.query<CategoryRes, string>({
      query: id => `/category/get/${id}`,
      providesTags: ['getCategory']
    })
  })
});

// Export hooks
export const {
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
  useGetCategoryQuery
} = categoryService;
