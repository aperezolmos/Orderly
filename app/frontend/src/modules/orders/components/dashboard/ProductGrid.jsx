import { useEffect } from 'react';
import { Grid, Group, Text, Pagination, Badge } from '@mantine/core';
import ProductCard from './ProductCard';
import { useOrderDashboardStore } from '../../store/orderDashboardStore';


const ProductGrid = () => {
  const {
    products,
    activePage,
    totalPages,
    fetchProducts,
    addProductToOrder,
    setActivePage,
    //isLoadingProducts,
  } = useOrderDashboardStore();


  useEffect(() => {
    fetchProducts(activePage);
  }, [activePage]);

  const categories = ['Food', 'Drink', 'Dessert'];


  return (
    <div className="product-grid">
      <Group mb="md" gap="xs">
        {categories.map(category => (
          <Badge key={category} variant="light" color="blue">
            {category}
          </Badge>
        ))}
      </Group>
      <Grid gutter="md">
        {products.map((product) => (
          <Grid.Col key={product.id} span={{ base: 6, sm: 4, md: 3, lg: 3 }}>
            <ProductCard
              product={product}
              onSelect={() => addProductToOrder(product)}
            />
          </Grid.Col>
        ))}
      </Grid>
      {totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            value={activePage}
            onChange={setActivePage}
            total={totalPages}
            withEdges
          />
        </Group>
      )}
      <Group justify="center" mt="md">
        <Text size="sm" c="dimmed">
          Página {activePage} de {totalPages} • {products.length} productos mostrados
        </Text>
      </Group>
    </div>
  );
};

export default ProductGrid;
