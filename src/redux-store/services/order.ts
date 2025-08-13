import {
  IDashboardRecentOrders,
  IGetAllOrdersRes,
  IOrdersReport,
  ISalesReport,
  IUpdateStatusOrderRes,
  Order
} from '@/types/apps/orderTypes';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuthRedirect } from '@/utils/baseQuery';

export const orderService = createApi({
  reducerPath: 'orderService',
  baseQuery: baseQueryWithAuthRedirect,
  // ✅ Declare tag types used in providesTags/invalidatesTags
  tagTypes: ['AllOrder', 'getOrder'],
  endpoints: builder => ({
    // Get weekly sales report
    getSalesReportWeekly: builder.query<ISalesReport, void>({
      query: () => `/order/count-weekly-sale`,
      keepUnusedDataFor: 600
    }),
    // Get monthly sales report
    getSalesReportMonthly: builder.query<ISalesReport, void>({
      query: () => `/order/count-monthly-sale`,
      keepUnusedDataFor: 600
    }),
    // Get recent orders
    getRecentOrders: builder.query<IDashboardRecentOrders, void>({
      query: () => `/user-order/dashboard-recent-order`,
      providesTags: ['AllOrder'],
      keepUnusedDataFor: 600
    }),
    // Get weekly order details
    getWeeklyOrderCount: builder.query<IOrdersReport, void>({
      query: () => `/order/count-weekly-order`,
      keepUnusedDataFor: 600
    }),
    // Get monthly order details
    getMonthlyOrderCount: builder.query<IOrdersReport, void>({
      query: () => `/order/count-monthly-order`,
      keepUnusedDataFor: 600
    }),
    // Get All orders
    getAllOrders: builder.query<IGetAllOrdersRes, void>({
      query: () => `/order/orders`,
      providesTags: ['AllOrder'],
      keepUnusedDataFor: 600
    }),
    // Get single order
    getSingleOrder: builder.query<Order, string>({
      query: id => `/order/${id}`,
      providesTags: ['getOrder'],
      keepUnusedDataFor: 600
    }),
    // Update orders status
    updateStatus: builder.mutation<IUpdateStatusOrderRes, { id: string; status: { status: string } }>({
      query: ({ id, status }) => ({
        url: `/order/update-status/${id}`,
        method: 'PUT',
        body: status
      }),
      invalidatesTags: ['AllOrder', 'getOrder']
    })
  })
});

export const {
  useGetAllOrdersQuery,
  useGetSingleOrderQuery,
  useGetRecentOrdersQuery,
  useGetSalesReportWeeklyQuery,
  useGetSalesReportMonthlyQuery,
  useGetWeeklyOrderCountQuery,
  useGetMonthlyOrderCountQuery,
  useUpdateStatusMutation
} = orderService;
