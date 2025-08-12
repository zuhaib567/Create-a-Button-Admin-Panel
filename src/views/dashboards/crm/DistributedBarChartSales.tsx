'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'
import { useGetSalesReportWeeklyQuery } from '@/redux-store/services/order'
import { Skeleton } from '@mui/material'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const DistributedBarChartSales = () => {
  const { data, isLoading } = useGetSalesReportWeeklyQuery()
  const theme = useTheme()

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const report = data?.report || []

  // Current week sales amounts
  const currentWeekAmounts: number[] = daysOfWeek.map(day => {
    const match = report.find(item => item.day === day)
    return match ? Number(match.totalAmount) : 0
  })

  const totalAmount = currentWeekAmounts.reduce((sum, val) => sum + val, 0)

  // Dynamic previous week total if available
  const previousWeekTotal = data?.previousWeekTotal || 0
  const percentageChange =
    previousWeekTotal && previousWeekTotal !== 0
      ? Number((((totalAmount - previousWeekTotal) / previousWeekTotal) * 100).toFixed(1))
      : 0

  const series = [{ data: currentWeekAmounts }]
  const actionSelectedColor = 'var(--mui-palette-action-selected)'
  const successColor = theme.palette.success.main

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: false,
      parentHeightOffset: 0,
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: val => `$${val}`
      }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: [`${successColor}`],
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    },
    plotOptions: {
      bar: {
        borderRadius: 3,
        horizontal: false,
        columnWidth: '45%',
        colors: {
          backgroundBarRadius: 5,
          backgroundBarColors: new Array(7).fill(actionSelectedColor)
        }
      }
    },
    grid: {
      show: false,
      padding: {
        left: -3,
        right: 5,
        top: 15,
        bottom: 18
      }
    },
    xaxis: {
      categories: daysOfWeek,
      labels: {
        show: true,
        style: { fontSize: '12px' }
      },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: { show: false },
    responsive: [
      {
        breakpoint: 1350,
        options: {
          plotOptions: {
            bar: { columnWidth: '35%' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          plotOptions: {
            bar: { columnWidth: '25%' }
          }
        }
      },
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: { columnWidth: '15%' }
          }
        }
      }
    ]
  }

  if (isLoading) {
    return <Skeleton variant='rounded' className='w-full' height={138} />
  }

  return (
    <Card>
      <CardHeader title='Sales' subheader='Last 7 Days' className='pbe-0' />
      <CardContent className='flex flex-col'>
        <AppReactApexCharts type='bar' height={84} width='100%' options={options} series={series} />
        <div className='flex items-center justify-between flex-wrap gap-x-4 gap-y-0.5'>
          <Typography variant='h4' color='text.primary'>
            ${totalAmount.toLocaleString()}
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default DistributedBarChartSales
