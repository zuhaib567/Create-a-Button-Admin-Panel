import {
  TemplateRes,
  TemplateResponse,
  IAddTemplate,
  IAddTemplateResponse,
  ITemplateDeleteRes
} from '@/types/apps/templateTypes';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuthRedirect } from '@/utils/baseQuery';

export const templateService = createApi({
  reducerPath: 'templateService',
  baseQuery: baseQueryWithAuthRedirect,
  // ✅ Declare tag types used in providesTags/invalidatesTags
  tagTypes: ['AllTemplate', 'getTemplate'],
  endpoints: builder => ({
    // Get all templates
    getAllTemplates: builder.query<TemplateResponse, void>({
      query: () => `/templates`,
      providesTags: ['AllTemplate'],
      keepUnusedDataFor: 600
    }),
    // Add template
    addTemplate: builder.mutation<IAddTemplateResponse, IAddTemplate>({
      query(data: IAddTemplate) {
        return {
          url: `/templates`,
          method: 'POST',
          body: data
        };
      },
      invalidatesTags: ['AllTemplate', 'getTemplate']
    }),
    // Delete template
    deleteTemplate: builder.mutation<ITemplateDeleteRes, string>({
      query(id: string) {
        return {
          url: `/templates/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['AllTemplate', 'getTemplate']
    }),
    // Edit template
    editTemplate: builder.mutation<IAddTemplateResponse, { id: string; data: Partial<TemplateRes> }>({
      query({ id, data }) {
        return {
          url: `/templates/${id}`,
          method: 'PUT',
          body: data
        };
      },
      invalidatesTags: ['AllTemplate', 'getTemplate']
    }),
    // Get single template
    getTemplate: builder.query<TemplateRes, string>({
      query: id => `/templates/${id}`,
      providesTags: ['getTemplate']
    })
  })
});

export const {
  useGetAllTemplatesQuery,
  useAddTemplateMutation,
  useDeleteTemplateMutation,
  useEditTemplateMutation,
  useGetTemplateQuery
} = templateService;
