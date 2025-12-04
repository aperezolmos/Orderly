import { Grid, Container, Paper, Title, Group, Space, Text } from '@mantine/core';
import { IconListCheck, IconChefHat } from '@tabler/icons-react';
import ProductGrid from '../components/dashboard/ProductGrid';
import OrderDashboardSection from '../components/dashboard/OrderDashboardSection';


const OrderDashboardPage = () => {
  
  return (
    <Container size="xl" py="xl">
      <Grid gutter="lg">

        {/* Left section: ORDERS */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Paper shadow="md" p="md" withBorder>
            <Group mb="md">
              <IconChefHat size={24} />
              <Title order={2}>Gestión de pedidos</Title>
            </Group>
            <OrderDashboardSection />
          </Paper>
        </Grid.Col>


        {/* Right section: PRODUCTS */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Paper shadow="md" p="md" withBorder>
            <Group mb="md">
              <IconListCheck size={24} />
              <Title order={2}>Productos disponibles</Title>
            </Group>
            <ProductGrid />
          </Paper>
        </Grid.Col>

      </Grid>
    </Container>
  );
};

export default OrderDashboardPage;
