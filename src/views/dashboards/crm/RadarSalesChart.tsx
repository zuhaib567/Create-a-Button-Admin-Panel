'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// Third Party Imports
import type { ApexOptions } from 'apexcharts'

// Components Imports
import OptionMenu from '@core/components/option-menu'

import { useGetRecentOrdersQuery } from '@/redux-store/services/order'
import { Skeleton } from '@mui/material'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Vars
// const series = [
//   { name: 'Sales', data: [32, 27, 27, 30, 25, 25] },
//   { name: 'Visits', data: [25, 35, 20, 20, 20, 20] }
// ]

const RadarSalesChart = () => {
  const { data: ordersData, isLoading } = useGetRecentOrdersQuery()
  const orders = ordersData?.orders || []

  // Hooks
  const theme = useTheme()

  // Last 6 months labels (e.g., ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'])
  const now = new Date()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const last6MonthsLabels: string[] = []

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    last6MonthsLabels.push(months[date.getMonth()])
  }

  // Initialize sales and visits data arrays
  const salesData = Array(6).fill(0)
  const visitsData = Array(6).fill(0)

  // Fill data from orders
  orders.forEach(order => {
    const orderDate = new Date(order.createdAt)
    const monthDiff = now.getMonth() - orderDate.getMonth() + (now.getFullYear() - orderDate.getFullYear()) * 12

    if (monthDiff >= 0 && monthDiff < 6) {
      const index = 5 - monthDiff
      salesData[index] += Number(order.totalAmount)
      visitsData[index] += 1
    }
  })

  // Chart series
  const series = [
    { name: 'Sales', data: salesData },
    { name: 'Visits', data: visitsData }
  ]

  // Vars
  const textDisabled = 'var(--mui-palette-text-disabled)'
  const divider = 'var(--mui-palette-divider)'

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    colors: ['var(--mui-palette-primary-main)', 'var(--mui-palette-info-main)'],
    plotOptions: {
      radar: {
        polygons: {
          connectorColors: divider,
          strokeColors: divider
        }
      }
    },
    stroke: { width: 0 },
    fill: {
      opacity: [1, 0.85]
    },
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    markers: { size: 0 },
    legend: {
      fontSize: '13px',
      labels: { colors: 'var(--mui-palette-text-secondary)' },
      markers: { offsetY: -1, offsetX: theme.direction === 'rtl' ? 7 : -4 },
      itemMargin: { horizontal: 9 }
    },
    grid: { show: false },
    xaxis: {
      labels: {
        show: true,
        style: {
          fontSize: '13px',
          colors: [textDisabled, textDisabled, textDisabled, textDisabled, textDisabled, textDisabled]
        }
      }
    },
    yaxis: { show: false },
    responsive: [
      {
        breakpoint: 1200,
        options: {
          chart: {
            height: 332
          }
        }
      }
    ]
  }

  if (isLoading) {
    return <Skeleton variant='rounded' className='w-full' height={388} />
  }

  return (
    <Card>
      <CardHeader
        title='Sales'
        subheader='Last 6 Months'
        action={<OptionMenu options={['Last Month', 'Last 6 months', 'Last Year']} />}
      />
      <CardContent>
        <AppReactApexCharts type='radar' height={373} width='100%' series={series} options={options} />
      </CardContent>
    </Card>
  )
}

export default RadarSalesChart
