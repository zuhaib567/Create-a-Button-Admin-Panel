import { IAdminUpdate, IAdminUpdateRes } from '@/types/apps/userTypes'
import { IUserGoogleRes } from '@/types/pages/profileTypes'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Common error type returned by the backend
export interface ApiError {
  message: string
}

export interface ErrorResponse {
  data: ApiError
  status: number
}

// Login
export interface LoginRequest {
  email: string
  password: string
}
export interface LoginResponse {
  _id: string
  token: string
  email: string
  role: string
  joiningDate: string
  isGoogleSignup: boolean
}

// Register
export interface RegisterRequest {
  name: string
  email: string
  password: string
}
export interface RegisterResponse {
  data?: {
    token: string
    user: {
      id: string
      name: string
      email: string
    }
  }
  error?: ApiError
}

// Google Signup
export interface GoogleSignupRequest {
  idToken: string // e.g. Google OAuth token
}
export type GoogleSignupResponse = IUserGoogleRes

export const authService = createApi({
  reducerPath: 'authService',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/`,
    credentials: 'include'
  }),
  endpoints: builder => ({
    // Login
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: credentials => ({
        url: '/admin/login',
        method: 'POST',
        body: credentials
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)
          localStorage.setItem('token', JSON.stringify(data?.token))
        } catch (err) {
          // handle error if needed
        }
      }
    }),

    // Signup with Google
    signupWithGoogle: builder.mutation<GoogleSignupResponse, GoogleSignupRequest>({
      query: body => ({
        url: '/admin/google-signup',
        method: 'POST',
        body
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const data = await queryFulfilled
          localStorage.setItem('token', JSON.stringify(data.token))
        } catch (err) {
          // handle error if needed
        }
      }
    }),

    // Register
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: userData => ({
        url: '/admin/register',
        method: 'POST',
        body: userData
      })
    }),

    // Update Auth
    updateAuth: builder.mutation<IAdminUpdateRes, { id: string; data: IAdminUpdate }>({
      query: ({ id, data }) => ({
        url: `/admin/update-stuff/${id}`,
        method: 'POST',
        body: data
      })
    })
  })
})

export const { useLoginMutation, useRegisterMutation, useSignupWithGoogleMutation, useUpdateAuthMutation } = authService
