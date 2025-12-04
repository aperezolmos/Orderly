import { Grid, Container, Paper, Title, Group, Space, Text } from '@mantine/core';
import ProductGrid from '../components/dashboard/ProductGrid';


const OrderDashboardPage = () => {
  
  return (
    <Container size="xl" py="xl">
      <Grid gutter="lg">

        {/* Left section: ORDERS */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Paper shadow="md" p="md" withBorder>
            <Text size="sm" c="dimmed">Pedidos - Se implementará luego</Text>
          </Paper>
        </Grid.Col>


        {/* Right section: PRODUCTS */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Paper shadow="md" p="md" withBorder>
            <Title order={2} mb="md">Productos Disponibles</Title>
            <ProductGrid />
          </Paper>
        </Grid.Col>

      </Grid>
    </Container>
  );
};

export default OrderDashboardPage;
