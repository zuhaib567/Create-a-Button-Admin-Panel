import {
  CategoryRes,
  CategoryResponse,
  IAddCategory,
  IAddCategoryResponse,
  ICategoryDeleteRes
} from '@/types/apps/templateCategoryTypes';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuthRedirect } from '@/utils/baseQuery';

export const templateCategoryService = createApi({
  reducerPath: 'templateCategoryService',
  baseQuery: baseQueryWithAuthRedirect,
  // ✅ Declare tag types used in providesTags/invalidatesTags
  tagTypes: ['AllTemplateCategory', 'getTemplateCategory'],
  endpoints: builder => ({
    // Get all template categories
    getAllTemplateCategories: builder.query<CategoryResponse, void>({
      query: () => `/template-categories/`,
      providesTags: ['AllTemplateCategory'],
      keepUnusedDataFor: 600
    }),
    // Add template category
    addTemplateCategory: builder.mutation<IAddCategoryResponse, IAddCategory>({
      query(data: IAddCategory) {
        console.log(data);

        return {
          url: `/template-categories/`,
          method: 'POST',
          body: data
        };
      },
      invalidatesTags: ['AllTemplateCategory', 'getTemplateCategory']
    }),
    // Delete template category
    deleteTemplateCategory: builder.mutation<ICategoryDeleteRes, string>({
      query(id: string) {
        return {
          url: `/template-categories/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['AllTemplateCategory', 'getTemplateCategory']
    }),
    // Edit template category
    editTemplateCategory: builder.mutation<IAddCategoryResponse, { id: string; data: Partial<CategoryRes> }>({
      query({ id, data }) {
        return {
          url: `/template-categories/${id}`,
          method: 'PUT',
          body: data
        };
      },
      invalidatesTags: ['AllTemplateCategory', 'getTemplateCategory']
    }),
    // Get single template category
    getTemplateCategory: builder.query<CategoryRes, string>({
      query: id => `/template-categories/${id}`,
      providesTags: ['getTemplateCategory']
    })
  })
});

export const {
  useGetAllTemplateCategoriesQuery,
  useAddTemplateCategoryMutation,
  useDeleteTemplateCategoryMutation,
  useEditTemplateCategoryMutation,
  useGetTemplateCategoryQuery
} = templateCategoryService;
