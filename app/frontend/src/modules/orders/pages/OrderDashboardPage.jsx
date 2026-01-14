import { Grid, Container, Paper, Title, Group } from '@mantine/core';
import { IconListCheck, IconChefHat } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import ProductGrid from '../components/groups/ProductGrid';
import OrderDashboardSection from '../components/OrderDashboardSection';
import { useOrderDashboard } from '../hooks/useOrderDashboard';


const OrderDashboardPage = () => {
  
  const { t } = useTranslation(['orders']);
  
  // Initialize hook that triggers order and product loading
  useOrderDashboard();
  

  return (
    <Container size="xl" py="xl">
      <Grid gutter="lg">

        {/* Left section: ORDERS */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Paper shadow="md" p="md" withBorder>
            <Group mb="md">
              <IconChefHat size={24} />
              <Title order={2}>{t('orders:management.title')}</Title>
            </Group>
            <OrderDashboardSection />
          </Paper>
        </Grid.Col>


        {/* Right section: PRODUCTS */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Paper shadow="md" p="md" withBorder>
            <Group mb="md">
              <IconListCheck size={24} />
              <Title order={2}>{t('orders:dashboard.productsAvailable')}</Title>
            </Group>
            <ProductGrid />
          </Paper>
        </Grid.Col>

      </Grid>
    </Container>
  );
};

export default OrderDashboardPage;
