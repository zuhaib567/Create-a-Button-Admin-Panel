import { IAddProduct, ProductResponse } from '@/types/pages/productTypes'

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

interface IProductResponse {
  success: boolean
  status: string
  message: string
  data: any
}

interface IProductEditResponse {
  data: IAddProduct
  message: string
}

export const productService = createApi({
  reducerPath: 'productService',
  baseQuery: baseQueryWithAuthRedirect,
  endpoints: builder => ({
    getAllProducts: builder.query<ProductResponse, void>({
      query: () => `/products/all`
    }),
    // add product
    addProduct: builder.mutation<IProductResponse, IAddProduct>({
      query(data: IAddProduct) {
        return {
          url: `/products/add`,
          method: 'POST',
          body: data
        }
      }
    }),
    // edit product
    editProduct: builder.mutation<IProductEditResponse, { id: string; data: Partial<IAddProduct> }>({
      query({ id, data }) {
        return {
          url: `/products/edit-product/${id}`,
          method: 'PATCH',
          body: data
        }
      }
    }),
    // get single product
    getProduct: builder.query<IAddProduct, string>({
      query: id => `/products/${id}`
    })
  })
})

export const { useGetAllProductsQuery, useAddProductMutation, useEditProductMutation } = productService
