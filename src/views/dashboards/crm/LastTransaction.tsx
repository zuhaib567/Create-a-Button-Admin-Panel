'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Chip,
  IconButton,
  MenuItem,
  Typography,
  Skeleton
} from '@mui/material'
import { useColorScheme } from '@mui/material/styles'

// Components
import OptionMenu from '@core/components/option-menu'
import CustomTextField from '@/@core/components/mui/TextField'

// Redux
import { useGetRecentOrdersQuery, useUpdateStatusMutation } from '@/redux-store/services/order'

// Styles
import tableStyles from '@core/styles/table.module.css'

// Types
import type { Row } from '@tanstack/react-table'
import type { ThemeColor, SystemMode } from '@core/types'
import type { InvoiceTypeWithAction, IStatusType } from '@/types/apps/invoiceTypes'

type StatusColor = {
  text: string
  color: ThemeColor
}

const statusMap: Record<keyof IStatusType, StatusColor> = {
  delivered: { text: 'Delivered', color: 'success' },
  pending: { text: 'Pending', color: 'warning' },
  processing: { text: 'Processing', color: 'default' },
  cancel: { text: 'Cancelled', color: 'error' }
}

const SimpleSelectField = ({ row }: { row: Row<InvoiceTypeWithAction> }) => {
  const [updateStatus, { isLoading }] = useUpdateStatusMutation()

  const handleStatusChange = (id: string, status: keyof IStatusType) => {
    updateStatus({ id, status: { status } })
  }

  return (
    <CustomTextField
      select
      id={`select-status-${row.original?._id}`}
      value={row.original?.status}
      onChange={e => handleStatusChange(row.original?._id, e.target.value as keyof IStatusType)}
      className='max-sm:is-full sm:is-[160px]'
      SelectProps={{ displayEmpty: true }}
    >
      <MenuItem value=''>Select Status</MenuItem>
      <MenuItem value='delivered'>{isLoading ? 'Loading...' : 'Delivered'}</MenuItem>
      <MenuItem value='processing'>{isLoading ? 'Loading...' : 'Processing'}</MenuItem>
      <MenuItem value='pending'>{isLoading ? 'Loading...' : 'Pending'}</MenuItem>
      <MenuItem value='cancel'>{isLoading ? 'Loading...' : 'Cancelled'}</MenuItem>
    </CustomTextField>
  )
}

const LastTransaction = ({ serverMode }: { serverMode: SystemMode }) => {
  const { data, isLoading, isError } = useGetRecentOrdersQuery()
  const { mode } = useColorScheme()
  const _mode = (mode === 'system' ? serverMode : mode) || serverMode
  const { lang: locale } = useParams()
  const [rowStatuses, setRowStatuses] = useState<Record<string, string>>({})

  const handlePrint = () => window.print()

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

  if (isError) {
    return (
      <Card
        sx={{
          borderColor: 'error.main',
          backgroundColor: theme => theme.palette.error.light + '20'
        }}
        className='my-[20px] max-w-full py-[1px] px-[2px] border-l-[5px]'
      >
        <CardContent className='flex items-center h-[50px]'>
          <Box>
            <Typography variant='h6' color='error.main'>
              Network error — Please check your internet connection.
            </Typography>
            <Typography variant='body2' color='text.secondary'></Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title='Recent Orders' action={<OptionMenu options={['Show all entries', 'Refresh', 'Download']} />} />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead className='uppercase'>
            <tr className='border-be'>
              <th className='leading-6 plb-4 pli-2'>Date</th>
              <th className='leading-6 plb-4 pli-2'>Customer</th>
              <th className='leading-6 plb-4 pli-2'>Amount</th>
              <th className='leading-6 plb-4 pli-2'>Status</th>
              <th className='leading-6 plb-4 pli-2'>Action</th>
              <th className='leading-6 plb-4 pie-6 pli-2 text-right'>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {data?.orders.slice(0, 10).map(order => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString()

              return (
                <tr key={order._id} className='border-0'>
                  <td className='pli-2 plb-3'>
                    <div className='flex flex-col'>
                      <Typography color='text.primary'>Order Date:</Typography>
                      <Typography variant='body2' color='text.disabled'>
                        {formattedDate}
                      </Typography>
                    </div>
                  </td>
                  <td className='pli-2 plb-3'>
                    <Typography color='text.primary'>{order.name}</Typography>
                  </td>
                  <td className='pli-2 plb-3'>
                    <Typography color='text.primary'>${order.totalAmount.toLocaleString()}</Typography>
                  </td>
                  <td className='pli-2 plb-3'>
                    {order.status && (
                      <Chip
                        variant='tonal'
                        size='small'
                        label={statusMap[order.status]?.text}
                        color={statusMap[order.status]?.color}
                      />
                    )}
                  </td>
                  <td className='pli-2 plb-3'>
                    <SimpleSelectField row={{ original: order } as Row<InvoiceTypeWithAction>} />
                  </td>
                  <td className='pli-2 plb-3 pie-6 text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <Button
                        variant='outlined'
                        size='small'
                        className='text-primary border-primary hover:bg-actionHover'
                        component={Link}
                        href={`/${locale}/dashboard/orders/${order._id}`}
                      >
                        View
                      </Button>
                      <Button size='small' color='secondary' variant='tonal' onClick={handlePrint}>
                        Print
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default LastTransaction
