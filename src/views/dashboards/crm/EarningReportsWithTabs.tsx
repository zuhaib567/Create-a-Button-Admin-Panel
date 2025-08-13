'use client';

// React Imports
import { useState } from 'react';
import type { SyntheticEvent } from 'react';

// Next Imports
import dynamic from 'next/dynamic';

// MUI Imports
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// Third Party Imports
import classnames from 'classnames';
import type { ApexOptions } from 'apexcharts';

// Components Imports
import OptionMenu from '@core/components/option-menu';
import CustomAvatar from '@core/components/mui/Avatar';

import { useGetRecentOrdersQuery } from '@/redux-store/services/order';
import { Skeleton } from '@mui/material';

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'));

type ApexChartSeries = NonNullable<ApexOptions['series']>;
type ApexChartSeriesData = Exclude<ApexChartSeries[0], number>;
type TabCategory = 'orders' | 'sales';

type TabType = {
  type: TabCategory;
  avatarIcon: string;
  series: ApexChartSeries;
};

const renderTabs = (value: TabCategory, tabData: TabType[]) => {
  return tabData.map(item => (
    <Tab
      key={item.type}
      value={item.type}
      className='mie-4'
      label={
        <div
          className={classnames(
            'flex flex-col items-center justify-center gap-2 is-[110px] bs-[100px] border rounded-xl',
            item.type === value ? 'border-solid border-[var(--mui-palette-primary-main)]' : 'border-dashed'
          )}
        >
          <CustomAvatar variant='rounded' skin='light' size={38} {...(item.type === value && { color: 'primary' })}>
            <i className={classnames('text-[22px]', { 'text-textSecondary': item.type !== value }, item.avatarIcon)} />
          </CustomAvatar>
          <Typography className='font-medium capitalize' color='text.primary'>
            {item.type}
          </Typography>
        </div>
      }
    />
  ));
};

const renderTabPanels = (
  value: TabCategory,
  theme: any,
  options: ApexOptions,
  colors: string[],
  tabData: TabType[]
) => {
  return tabData.map(item => {
    const dataPoints = (item.series[0] as ApexChartSeriesData).data as number[];
    const max = Math.max(...dataPoints);
    const seriesIndex = dataPoints.indexOf(max);
    const finalColors = colors.map((color, i) => (seriesIndex === i ? 'var(--mui-palette-primary-main)' : color));

    return (
      <TabPanel key={item.type} value={item.type} className='!p-0'>
        <AppReactApexCharts
          type='bar'
          height={233}
          width='100%'
          options={{ ...options, colors: finalColors }}
          series={item.series}
        />
      </TabPanel>
    );
  });
};

const EarningReportsWithTabs = () => {
  const { data: ordersData, isLoading } = useGetRecentOrdersQuery();
  const orders = ordersData?.orders || [];

  const monthlyCounts = Array(12).fill(0);
  const monthlyAmounts = Array(12).fill(0);

  orders.forEach(order => {
    const date = new Date(order.createdAt);
    const monthIndex = date.getMonth();

    monthlyCounts[monthIndex] += 1;
    monthlyAmounts[monthIndex] += Number(order.totalAmount);
  });

  const [value, setValue] = useState<TabCategory>('orders');
  const theme = useTheme();
  const disabledText = 'var(--mui-palette-text-disabled)';

  const handleChange = (event: SyntheticEvent, newValue: TabCategory) => {
    setValue(newValue);
  };

  const colors = Array(9).fill('var(--mui-palette-primary-lightOpacity)');

  const options: ApexOptions = {
    chart: { parentHeightOffset: 0, toolbar: { show: false } },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '33%',
        borderRadiusApplication: 'end',
        dataLabels: { position: 'top' }
      }
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: {
      offsetY: -11,
      formatter: val => (value === 'sales' ? `$${val}` : `${val}`),
      style: {
        fontWeight: 500,
        colors: ['var(--mui-palette-text-primary)'],
        fontSize: theme.typography.body1.fontSize as string
      }
    },
    colors,
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    },
    grid: {
      show: false,
      padding: { top: -19, left: -4, right: 0, bottom: -11 }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { color: 'var(--mui-palette-divider)' },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      labels: {
        style: {
          colors: disabledText,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -18,
        formatter: val => `${val}`,
        style: {
          colors: disabledText,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string
        }
      }
    },
    responsive: [
      {
        breakpoint: 1450,
        options: { plotOptions: { bar: { columnWidth: '45%' } } }
      },
      {
        breakpoint: 600,
        options: {
          dataLabels: { style: { fontSize: theme.typography.body2.fontSize as string } },
          plotOptions: { bar: { columnWidth: '58%' } }
        }
      },
      {
        breakpoint: 500,
        options: { plotOptions: { bar: { columnWidth: '70%' } } }
      }
    ]
  };

  const tabData: TabType[] = [
    {
      type: 'orders',
      avatarIcon: 'tabler-shopping-cart',
      series: [{ data: monthlyCounts.slice(0, 9) }]
    },
    {
      type: 'sales',
      avatarIcon: 'tabler-chart-bar',
      series: [{ data: monthlyAmounts.slice(0, 9) }]
    }
  ];

  if (isLoading) {
    return <Skeleton variant='rounded' className='size-full' />;
  }

  console.log(monthlyCounts.slice(0, 9));
  return (
    <Card>
      <CardHeader
        title='Orders Reports'
        subheader='Yearly Orders Overview'
        action={<OptionMenu options={['Last Week', 'Last Month', 'Last Year']} />}
      />
      <CardContent>
        <TabContext value={value}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleChange}
            aria-label='earning report tabs'
            className='!border-0 mbe-10'
            sx={{ '& .MuiTabs-indicator': { display: 'none' }, '& .MuiTab-root': { padding: 0, border: 0 } }}
          >
            {renderTabs(value, tabData)}
          </TabList>
          {renderTabPanels(value, theme, options, colors, tabData)}
        </TabContext>
      </CardContent>
    </Card>
  );
};

export default EarningReportsWithTabs;
