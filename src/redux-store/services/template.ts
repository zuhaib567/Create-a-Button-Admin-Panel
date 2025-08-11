import {
  TemplateRes,
  TemplateResponse,
  IAddTemplate,
  IAddTemplateResponse,
  ITemplateDeleteRes
} from '@/types/apps/templateTypes'

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

export const templateService = createApi({
  reducerPath: 'templateService',
  baseQuery: baseQueryWithAuthRedirect,
  // ✅ Declare tag types used in providesTags/invalidatesTags
  tagTypes: ['AllTemplate', 'getTemplate'],
  endpoints: builder => ({
    // get all categories
    getAllTemplates: builder.query<TemplateResponse, void>({
      query: () => `/templates`,
      providesTags: ['AllTemplate'],
      keepUnusedDataFor: 600
    }),
    // add category
    addTemplate: builder.mutation<IAddTemplateResponse, IAddTemplate>({
      query(data: IAddTemplate) {
        return {
          url: `/templates`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['AllTemplate', 'getTemplate']
    }),
    // delete category
    deleteTemplate: builder.mutation<ITemplateDeleteRes, string>({
      query(id: string) {
        return {
          url: `/templates/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: ['AllTemplate', 'getTemplate']
    }),
    // editCategory
    editTemplate: builder.mutation<IAddTemplateResponse, { id: string; data: Partial<TemplateRes> }>({
      query({ id, data }) {
        return {
          url: `/templates/${id}`,
          method: 'PUT',
          body: data
        }
      },
      invalidatesTags: ['AllTemplate', 'getTemplate']
    }),
    // get single product
    getTemplate: builder.query<TemplateRes, string>({
      query: id => `/templates/${id}`,
      providesTags: ['getTemplate']
    })
  })
})

export const {
  useGetAllTemplatesQuery,
  useAddTemplateMutation,
  useDeleteTemplateMutation,
  useEditTemplateMutation,
  useGetTemplateQuery
} = templateService
