import { IAdminUpdate, IAdminUpdateRes } from '@/types/apps/userTypes'
import { IUserGoogleRes } from '@/types/pages/profileTypes'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authService = createApi({
  reducerPath: 'authService',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/`,
    credentials: 'include',
    timeout: 12000
  }),
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/admin/login',
        method: 'POST',
        body: credentials
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        const { data: response } = await queryFulfilled
        if (!!response) {
          localStorage.setItem('token', JSON.stringify(response?.token))
        }
      }
    }),
    signupWithGoogle: builder.mutation<IUserGoogleRes, any>({
      query: data => ({
        url: '/admin/google-signup',
        method: 'POST',
        body: data
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        const { data: response } = await queryFulfilled
        if (!!response) {
          localStorage.setItem('token', JSON.stringify(response?.token))
        }
      }
    }),
    register: builder.mutation({
      query: userData => ({
        url: '/admin/register',
        method: 'POST',
        body: userData
      })
    }),
    updateAuth: builder.mutation<IAdminUpdateRes, { id: string; data: IAdminUpdate }>({
      query: ({ id, ...data }) => ({
        url: `/admin/update-stuff/${id}`,
        method: 'POST',
        body: data.data
      })
    })
  })
})

export const { useLoginMutation, useRegisterMutation, useSignupWithGoogleMutation, useUpdateAuthMutation } = authService
