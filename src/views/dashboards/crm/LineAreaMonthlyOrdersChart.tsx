'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { useTheme } from '@mui/material/styles'
import { Skeleton } from '@mui/material'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'
import { useGetMonthlyOrderCountQuery } from '@/redux-store/services/order'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const LineAreaMonthlyOrdersChart = () => {
  const { data, isLoading } = useGetMonthlyOrderCountQuery({ interval: 'month' })
  const theme = useTheme()

  const report = data?.report || []

  // Sort in chronological order just in case API doesn't return sorted
  const sortedReport = [...report].sort((a, b) => {
    if (a.year === b.year) return a.monthNumber - b.monthNumber
    return a.year - b.year
  })

  // Extract months and values
  const months = sortedReport.map(entry => entry.month)
  const values = sortedReport.map(entry => Number(entry.count || 0))

  // Chart series
  const series = [{ name: 'Orders', data: values }]
  const successColor = theme.palette.primary.main

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    grid: {
      show: false,
      padding: {
        top: 10,
        bottom: 15
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityTo: 0,
        opacityFrom: 1,
        shadeIntensity: 1,
        stops: [0, 100],
        colorStops: [
          [
            {
              offset: 0,
              opacity: 0.4,
              color: successColor
            },
            {
              opacity: 0,
              offset: 100,
              color: 'var(--mui-palette-background-paper)'
            }
          ]
        ]
      }
    },
    theme: {
      monochrome: {
        enabled: true,
        shadeTo: 'light',
        shadeIntensity: 1,
        color: successColor
      }
    },
    xaxis: {
      categories: months,
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: { show: false }
  }

  if (isLoading) {
    return <Skeleton variant='rounded' className='w-full' height={138} />
  }

  return (
    <Card>
      <CardHeader title='Orders' subheader='Last Months' className='pbe-0' />
      <AppReactApexCharts type='area' height={84} width='100%' options={options} series={series} />
      <CardContent className='flex flex-col pbs-0'>
        <div className='flex items-center justify-between flex-wrap gap-x-4 gap-y-0.5'>
          <Typography variant='h4' color='text.primary'>
            {data?.currentMonthTotal?.toLocaleString() || 0}
          </Typography>
          <Typography
            variant='body2'
            color={
              data?.percentageChange > 0 ? 'success.main' : data?.percentageChange < 0 ? 'error.main' : 'text.secondary'
            }
          >
            {data?.percentageChange > 0 ? '+' : ''}
            {data?.percentageChange ?? 0}%
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default LineAreaMonthlyOrdersChart
