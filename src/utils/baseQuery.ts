import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Router } from 'next/router';

export const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/`,
  credentials: 'include',
  timeout: 12000,
  prepareHeaders: headers => {
    const token = localStorage.getItem('token');
    if (!!token) {
      headers.set('Authorization', `Bearer ${JSON.parse(token)}`);
    }
    return headers;
  }
});

// ✅ Wrapper for handling expired token
export const baseQueryWithAuthRedirect: typeof baseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    localStorage.removeItem('token');
    Router.replace('/login');
  }
  return result;
};
