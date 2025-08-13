// MUI Imports
import Grid from '@mui/material/Grid';

// Component Imports
import DistributedBarChartOrder from '@views/dashboards/crm/DistributedBarChartOrder';
import EarningReportsWithTabs from '@views/dashboards/crm/EarningReportsWithTabs';
import LastTransaction from '@views/dashboards/crm/LastTransaction';
import RadarSalesChart from '@views/dashboards/crm/RadarSalesChart';

// Server Action Imports
import DistributedBarChartSales from '@/views/dashboards/crm/DistributedBarChartSales';
import LineAreaMonthlyOrdersChart from '@/views/dashboards/crm/LineAreaMonthlyOrdersChart';
import LineAreaMonthlySalesChart from '@/views/dashboards/crm/LineAreaMonthlySalesChart';
import { getServerMode } from '@core/utils/serverHelpers';

const DashboardCRM = () => {
  // Vars
  const serverMode = getServerMode();

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={3}>
        <DistributedBarChartOrder />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <LineAreaMonthlyOrdersChart />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <DistributedBarChartSales />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <LineAreaMonthlySalesChart />
      </Grid>
      <Grid item xs={12} lg={8}>
        <EarningReportsWithTabs />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <RadarSalesChart />
      </Grid>
      <Grid item xs={12}>
        <LastTransaction serverMode={serverMode} />
      </Grid>
    </Grid>
  );
};

export default DashboardCRM;
