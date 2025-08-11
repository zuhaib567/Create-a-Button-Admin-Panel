'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'

// Third-party Imports
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import classnames from 'classnames'

// Type Imports
import type { InvoiceType } from '@/types/apps/invoiceTypes'
import type { ThemeColor } from '@core/types'
import type { Order } from '@/types/apps/orderTypes'

// Component Imports
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import { useGetAllOrdersQuery, useUpdateStatusMutation } from '@/redux-store/services/order'

import tableStyles from '@core/styles/table.module.css'
import DebouncedInput from '@/components/common/debounced-input'
import { Row } from '@tanstack/react-table'
import { Skeleton } from '@mui/material'
import { useQueryErrorHandler } from '@/hooks/useQueryErrorHandler'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type InvoiceTypeWithAction = Order & {
  action?: string
}

type InvoiceStatusObj = {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// Vars
const invoiceStatusObj: InvoiceStatusObj = {
  Sent: { color: 'secondary', icon: 'tabler-send-2' },
  Paid: { color: 'success', icon: 'tabler-check' },
  Draft: { color: 'primary', icon: 'tabler-mail' },
  'Partial Payment': { color: 'warning', icon: 'tabler-chart-pie-2' },
  'Past Due': { color: 'error', icon: 'tabler-alert-circle' },
  Downloaded: { color: 'info', icon: 'tabler-arrow-down' }
}

// Column Definitions
const columnHelper = createColumnHelper<InvoiceTypeWithAction>()

interface IStatusType {
  pending: string
  delivered: string
  processing: string
  cancel: string
}

const SimpleSelectField = ({ row }: { row: Row<InvoiceTypeWithAction> }) => {
  const [updateStatus, { isLoading }] = useUpdateStatusMutation()

  const handleStatusChange = (id: string, status: keyof IStatusType) => {
    updateStatus({ id, status: { status } })
  }

  return (
    <CustomTextField
      select
      id={`select-status-${row.original._id}`}
      value={row.original.status}
      onChange={e =>
        handleStatusChange(row.original._id, e.target.value as 'delivered' | 'processing' | 'cancel' | 'pending')
      }
      className='max-sm:is-full sm:is-[160px]'
      SelectProps={{ displayEmpty: true }}
    >
      <MenuItem value=''>Select Status</MenuItem>
      <MenuItem value='delivered'>{isLoading ? 'Loading...' : 'Delivered'}</MenuItem>
      <MenuItem value='processing'>{isLoading ? 'Loading...' : 'Processing'}</MenuItem>
      <MenuItem value='pending'>{isLoading ? 'Loading...' : 'Pending'}</MenuItem>
      <MenuItem value='cancel'>{isLoading ? 'Loading...' : 'Cancel'}</MenuItem>
    </CustomTextField>
  )
}
const InvoiceListTable = () => {
  // States
  const [status, setStatus] = useState<InvoiceType['invoiceStatus']>('')
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState<Order[]>([])
  const [filteredData, setFilteredData] = useState<Order[]>([])

  const { data: orders, isLoading, isError, error } = useGetAllOrdersQuery()
  const { handleQueryError } = useQueryErrorHandler()

  // Hooks
  const { lang: locale } = useParams()

  const handlePrint = () => window.print()

  useEffect(() => {
    if (orders?.data) {
      setData(orders?.data!)
      setFilteredData(orders?.data!)
    }
  }, [orders])

  const columns = useMemo<ColumnDef<InvoiceTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('name', {
        header: 'Customer',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.name}
          </Typography>
        )
      }),
      columnHelper.accessor('cart', {
        header: 'Quantity',
        cell: ({ row }) => (
          <Typography className='font-medium text-center' color='text.primary'>
            {row.original.cart.reduce((acc, curr) => acc + curr.orderQuantity, 0)}
          </Typography>
        )
      }),
      columnHelper.accessor('totalAmount', {
        header: 'Total',
        cell: ({ row }) => <Typography className='text-center'>{`$${row.original.totalAmount}`}</Typography>
      }),
      columnHelper.accessor('status', {
        header: () => <div className='text-center'>Status</div>,
        cell: ({ row }) => (
          <div className='flex items-center justify-center'>
            <span
              className={`text-sm ${
                row.original.status === 'pending'
                  ? 'text-orange-500 bg-orange-500/10'
                  : row.original.status === 'delivered'
                    ? 'text-green-500 bg-green-500/10'
                    : row.original.status === 'processing'
                      ? 'text-blue-500 bg-blue-500/10'
                      : row.original.status === 'cancel'
                        ? 'text-red-500 bg-red-500/10'
                        : ''
              } px-3 py-1 rounded-md leading-none font-medium text-end`}
            >
              {row.original.status}
            </span>
          </div>
        )
      }),
      columnHelper.accessor('createdAt', {
        header: () => <div className='text-center'>Date</div>,
        cell: ({ row }) => (
          <Typography className='text-center'>{dayjs(row.original.createdAt).format('MMM D, YYYY')}</Typography>
        )
      }),
      columnHelper.accessor('action', {
        header: () => <div className='text-center'>Update Status</div>,
        cell: ({ row }) => (
          <div className='flex items-center justify-center'>
            <SimpleSelectField row={row} />
          </div>
        ),
        enableSorting: false
      }),
      columnHelper.accessor('invoice', {
        header: () => <div className='text-center'>Invoice</div>,
        cell: ({ row }) => (
          <div className='flex items-center justify-end gap-2'>
            <Button variant='outlined' size='small' className='text-primary border-primary hover:bg-actionHover'>
              <Link href={`/${locale}/dashboard/orders/${row.original._id}`}>View</Link>
            </Button>
            <Button size='small' color='secondary' variant='tonal' className='capitalize' onClick={handlePrint}>
              Print
            </Button>
          </div>
        )
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
  )

  const table = useReactTable({
    data: filteredData || [],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  useEffect(() => {
    const filteredData = data?.filter(order => {
      if (status && order.status.toLowerCase().replace(/\s+/g, '-') !== status) return false

      return true
    })

    setFilteredData(filteredData!)
  }, [status, data, setFilteredData])

  useEffect(() => {
    if (!!error) {
      handleQueryError(error)
    }
  }, [error])

  if (isLoading) {
    return (
      <Card className='pb-4 px-2'>
        <Skeleton variant='rounded' className='w-full mt-4' height={35} />
        <Skeleton variant='rounded' className='w-full mt-4' height={35} />
        <Skeleton variant='rounded' className='w-full mt-4' height={35} />
        <Skeleton variant='rounded' className='w-full mt-4' height={35} />
        <Skeleton variant='rounded' className='w-full mt-4' height={35} />
        <Skeleton variant='rounded' className='w-full mt-4' height={35} />
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className='flex justify-between flex-col items-start md:items-center md:flex-row gap-4'>
        <div className='flex max-sm:flex-col max-sm:is-full sm:items-center gap-4'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Order'
            className='max-sm:is-full sm:is-[250px]'
          />
          {/* <CustomTextField
            select
            id='select-status'
            value={status}
            onChange={e => setStatus(e.target.value)}
            className='max-sm:is-full sm:is-[160px]'
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Order Status</MenuItem>
            <MenuItem value='pending'>Pending</MenuItem>
            <MenuItem value='delivered'>Delivered</MenuItem>
            <MenuItem value='processing'>Processing</MenuItem>
            <MenuItem value='cancel'>Cancel</MenuItem>
          </CustomTextField> */}
        </div>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 is-full sm:is-auto'>
          <div className='flex items-center gap-2 is-full sm:is-auto'>
            <Typography className='hidden sm:block'>Show</Typography>
            <CustomTextField
              select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className='is-[70px] max-sm:is-full'
            >
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='25'>25</MenuItem>
              <MenuItem value='50'>50</MenuItem>
            </CustomTextField>
          </div>

          <Button
            variant='contained'
            component={Link}
            startIcon={<i className='tabler-upload' />}
            href={'apps/invoice/add'}
            className='max-sm:is-full'
          >
            Export
          </Button>
        </div>
      </CardContent>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='tabler-chevron-up text-xl' />,
                            desc: <i className='tabler-chevron-down text-xl' />
                          }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                        </div>
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {table?.getFilteredRowModel()?.rows?.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table
                ?.getRowModel()
                ?.rows?.slice(0, table.getState().pagination.pageSize)!
                .map(row => {
                  return (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  )
                })}
            </tbody>
          )}
        </table>
      </div>
      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
      />
    </Card>
  )
}

export default InvoiceListTable
