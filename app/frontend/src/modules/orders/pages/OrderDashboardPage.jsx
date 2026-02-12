import { Grid, Container, Paper, Title, Group } from '@mantine/core';
import { IconListCheck, IconChefHat } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import ProductGrid from '../components/groups/ProductGrid';
import OrderDashboardSection from '../components/OrderDashboardSection';
import { useOrderDashboard } from '../hooks/useOrderDashboard';
import { useAuth } from '../../../context/AuthContext';
import { PERMISSIONS } from '../../../utils/permissions';
import AccessDeniedView from '../../../common/components/feedback/AccessDeniedView';


const OrderDashboardPage = () => {
  
  const { t } = useTranslation(['orders']);
  const { hasPermission } = useAuth();
  
  // Initialize hook that triggers order and product loading
  useOrderDashboard();

  const canViewProducts = hasPermission(PERMISSIONS.PRODUCT_VIEW);
  

  return (
    <Container size="xl" py="xl">
      <Grid gutter="lg">

        {/* Left section: ORDERS */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Paper 
            shadow="md" 
            p="md" 
            withBorder 
            h="100%"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <Group mb="md">
              <IconChefHat size={24} />
              <Title order={2}>{t('orders:management.title')}</Title>
            </Group>
            <OrderDashboardSection />
          </Paper>
        </Grid.Col>


        {/* Right section: PRODUCTS */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Paper 
            shadow="md" 
            p="md" 
            withBorder 
            h="100%"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <Group mb="md">
              <IconListCheck size={24} />
              <Title order={2}>{t('orders:dashboard.productsAvailable')}</Title>
            </Group>
            {canViewProducts ? <ProductGrid /> : <AccessDeniedView showHomeButton={false} />}
          </Paper>
        </Grid.Col>

      </Grid>
    </Container>
  );
};

export default OrderDashboardPage;
