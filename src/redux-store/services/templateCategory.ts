import {
  CategoryRes,
  CategoryResponse,
  IAddCategory,
  IAddCategoryResponse,
  ICategoryDeleteRes
} from '@/types/apps/templateCategoryTypes'

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

export const templateCategoryService = createApi({
  reducerPath: 'templateCategoryService',
  baseQuery: baseQueryWithAuthRedirect,
  // ✅ Declare tag types used in providesTags/invalidatesTags
  tagTypes: ['AllTemplateCategory', 'getTemplateCategory'],
  endpoints: builder => ({
    // get all categories
    getAllTemplateCategories: builder.query<CategoryResponse, void>({
      query: () => `/template-categories/`,
      providesTags: ['AllTemplateCategory'],
      keepUnusedDataFor: 600
    }),
    // add category
    addTemplateCategory: builder.mutation<IAddCategoryResponse, IAddCategory>({
      query(data: IAddCategory) {
        console.log(data)

        return {
          url: `/template-categories/`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['AllTemplateCategory', 'getTemplateCategory']
    }),
    // delete category
    deleteTemplateCategory: builder.mutation<ICategoryDeleteRes, string>({
      query(id: string) {
        return {
          url: `/template-categories/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: ['AllTemplateCategory', 'getTemplateCategory']
    }),
    // editTemplateCategory
    editTemplateCategory: builder.mutation<IAddCategoryResponse, { id: string; data: Partial<CategoryRes> }>({
      query({ id, data }) {
        return {
          url: `/template-categories/${id}`,
          method: 'PUT',
          body: data
        }
      },
      invalidatesTags: ['AllTemplateCategory', 'getTemplateCategory']
    }),
    // get single product
    getTemplateCategory: builder.query<CategoryRes, string>({
      query: id => `/template-categories/${id}`,
      providesTags: ['getTemplateCategory']
    })
  })
})

export const {
  useGetAllTemplateCategoriesQuery,
  useAddTemplateCategoryMutation,
  useDeleteTemplateCategoryMutation,
  useEditTemplateCategoryMutation,
  useGetTemplateCategoryQuery
} = templateCategoryService
