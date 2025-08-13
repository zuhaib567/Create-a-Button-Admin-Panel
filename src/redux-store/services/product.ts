import { IAddProduct, IProductDeleteRes, ProductResponse } from '@/types/apps/productTypes';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuthRedirect } from '@/utils/baseQuery';

interface IProductResponse {
  success: boolean;
  status: string;
  message: string;
  data: any;
}

interface IProductEditResponse {
  data: IAddProduct;
  message: string;
}

export const productService = createApi({
  reducerPath: 'productService',
  baseQuery: baseQueryWithAuthRedirect,
  // ✅ Declare tag types used in providesTags/invalidatesTags
  tagTypes: ['AllProduct', 'getProduct'],
  endpoints: builder => ({
    // Get all products
    getAllProducts: builder.query<ProductResponse, void>({
      query: () => `/products/all`,
      providesTags: ['AllProduct'],
      keepUnusedDataFor: 600
    }),
    // Add product
    addProduct: builder.mutation<IProductResponse, IAddProduct>({
      query(data: IAddProduct) {
        return {
          url: `/products/add`,
          method: 'POST',
          body: data
        };
      },
      invalidatesTags: ['AllProduct', 'getProduct']
    }),
    // Delete product
    deleteProduct: builder.mutation<IProductDeleteRes, string>({
      query(id: string) {
        return {
          url: `/products/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['AllProduct', 'getProduct']
    }),
    // Edit product
    editProduct: builder.mutation<IProductEditResponse, { id: string; data: Partial<IAddProduct> }>({
      query({ id, data }) {
        return {
          url: `/products/edit-product/${id}`,
          method: 'PATCH',
          body: data
        };
      },
      invalidatesTags: ['AllProduct', 'getProduct']
    }),
    // Get single product
    getProduct: builder.query<IAddProduct, string>({
      query: id => `/products/${id}`,
      providesTags: ['getProduct']
    })
  })
});

export const {
  useGetAllProductsQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  useGetProductQuery
} = productService;
