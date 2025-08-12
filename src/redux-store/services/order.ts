import {
  IDashboardRecentOrders,
  IGetAllOrdersRes,
  IGetMonthlyOrderCount,
  IGetWeeklyOrderCount,
  ISalesReport,
  IUpdateStatusOrderRes,
  Order
} from '@/types/apps/orderTypes'

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

export const orderService = createApi({
  reducerPath: 'orderService',
  baseQuery: baseQueryWithAuthRedirect,
  // ✅ Declare tag types used in providesTags/invalidatesTags
  tagTypes: ['AllOrder', 'getOrder'],
  endpoints: builder => ({
    // getUserOrders
    // getDashboardAmount: builder.query<IOrderAmounts, void>({
    //   query: () => `/order/dashboard-amount`,
    //   keepUnusedDataFor: 600
    // }),
    // weekly sales report
    getSalesReportWeekly: builder.query<ISalesReport, void>({
      query: () => `/user-order/sales-report?interval=week`,
      keepUnusedDataFor: 600
    }),
    // monthly sales report
    getSalesReportMonthly: builder.query<ISalesReport, void>({
      query: () => `/user-order/sales-report?interval=month`,
      keepUnusedDataFor: 600
    }),
    // // get selling category
    // getMostSellingCategory: builder.query<IMostSellingCategory, void>({
    //   query: () => `/order/most-selling-category`,
    //   keepUnusedDataFor: 600
    // }),
    // get recent orders
    getRecentOrders: builder.query<IDashboardRecentOrders, void>({
      query: () => `/user-order/dashboard-recent-order`,
      providesTags: ['AllOrder'],
      keepUnusedDataFor: 600
    }),
    // weekly order details
    getWeeklyOrderCount: builder.query<IGetWeeklyOrderCount, void>({
      query: () => `/order/count-weekly-order`,
      keepUnusedDataFor: 600
    }),
    // monthly order details
    getMonthlyOrderCount: builder.query<IGetMonthlyOrderCount, void>({
      query: () => `/order/count-monthly-order`,
      keepUnusedDataFor: 600
    }),
    // get All orders
    getAllOrders: builder.query<IGetAllOrdersRes, void>({
      query: () => `/order/orders`,
      providesTags: ['AllOrder'],
      keepUnusedDataFor: 600
    }),
    // get order by ID
    getSingleOrder: builder.query<Order, string>({
      query: id => `/order/${id}`,
      providesTags: ['getOrder'],
      keepUnusedDataFor: 600
    }),
    // update orders status
    updateStatus: builder.mutation<IUpdateStatusOrderRes, { id: string; status: { status: string } }>({
      query: ({ id, status }) => ({
        url: `/order/update-status/${id}`,
        method: 'PUT',
        body: status
      }),
      invalidatesTags: ['AllOrder', 'getOrder']
    })
  })
})

export const {
  useGetAllOrdersQuery,
  useGetSingleOrderQuery,
  useGetRecentOrdersQuery,
  useGetSalesReportWeeklyQuery,
  useGetSalesReportMonthlyQuery,
  useGetWeeklyOrderCountQuery,
  useGetMonthlyOrderCountQuery,
  useUpdateStatusMutation
} = orderService
