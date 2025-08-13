'use client';

// Next Imports
import dynamic from 'next/dynamic';

// MUI Imports
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import { Skeleton } from '@mui/material';

// Third-party Imports
import type { ApexOptions } from 'apexcharts';
import { useGetSalesReportMonthlyQuery } from '@/redux-store/services/order';

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'), { ssr: false });

const LineAreaMonthlySalesChart = () => {
  const { data: report, isLoading } = useGetSalesReportMonthlyQuery();
  const theme = useTheme();

  // Chart series
  const series = [{ data: report?.totalSales }];

  const totalMonthlyAmount = report?.totalSales?.reduce((acc, curr) => acc + curr, 0) ?? 0;

  const successColor = theme.palette.success.main;

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
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: { show: false }
  };

  if (isLoading) {
    return <Skeleton variant='rounded' className='w-full' height={138} />;
  }

  return (
    <Card>
      <CardHeader title='Sales' subheader='Last Months' className='pbe-0' />
      <AppReactApexCharts type='area' height={84} width='100%' options={options} series={series} />
      <CardContent className='flex flex-col pbs-0'>
        <div className='flex items-center justify-between flex-wrap gap-x-4 gap-y-0.5'>
          <Typography variant='h4' color='text.primary'>
            ${totalMonthlyAmount?.toLocaleString() || 0}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default LineAreaMonthlySalesChart;
