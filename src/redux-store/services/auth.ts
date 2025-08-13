import { IAdminUpdate, IAdminUpdateRes } from '@/types/apps/userTypes';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Login Request
export interface LoginRequest {
  email: string;
  password: string;
}
// Login Response
export interface LoginResponse {
  token: string;
  _id: string;
  name: string;
  email: string;
  status?: 'Active' | 'Inactive';
  role: 'Admin' | 'Super Admin' | 'Manager' | 'CEO';
  joiningDate: string;
  isGoogleSignup: boolean;
}

// Register Request
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
// Register Response
export interface RegisterResponse {
  token: string;
}

// Google Signup
export interface GoogleSignupRequest {
  idToken: string;
}

export type GoogleSignupResponse = {
  token: string;
  _id: string;
  name: string;
  image?: string;
  address?: string;
  country?: string;
  city?: string;
  email: string;
  phone?: string;
  status?: 'Active' | 'Inactive';
  password?: string;
  role: 'Admin' | 'Super Admin' | 'Manager' | 'CEO';
  joiningDate?: string;
  createdAt: string;
  updatedAt: string;
};

export const authService = createApi({
  reducerPath: 'authService',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/`,
    credentials: 'include',
    timeout: 12000
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
          const { data } = await queryFulfilled;
          localStorage.setItem('token', JSON.stringify(data.token));
        } catch {}
      }
    }),
    // Signup with google
    signupWithGoogle: builder.mutation<GoogleSignupResponse, GoogleSignupRequest>({
      query: body => ({
        url: '/admin/google-signup',
        method: 'POST',
        body
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem('token', JSON.stringify(data.token));
        } catch {}
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
});

export const { useLoginMutation, useRegisterMutation, useSignupWithGoogleMutation, useUpdateAuthMutation } =
  authService;
