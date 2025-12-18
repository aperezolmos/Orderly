import { useEffect } from 'react';
import { Grid, Group, Text, Pagination, Badge } from '@mantine/core';
import ProductCard from './ProductCard';
import { useOrderDashboardStore } from '../../store/orderDashboardStore';
import { useTranslation } from 'react-i18next';


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

  const { t } = useTranslation(['orders']);


  //const categories = ['Food', 'Drink', 'Dessert']; // TODO: Ejemplo. Ajustar cuando haya categorías reales

  useEffect(() => {
    fetchProducts(activePage);
  }, [activePage]);


  return (
    <div className="product-grid">
      {/* <Group mb="md" gap="xs">
        {categories.map(category => (
          <Badge key={category} variant="light" color="blue">
            {category}
          </Badge>
        ))}
      </Group> */}
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
          {t('orders:dashboard.pageFooter', {
            page: activePage,
            totalPages,
            count: products.length,
          }, {
            defaultValue: 'Página {{page}} de {{totalPages}} • {{count}} productos mostrados'
          })}
        </Text>
      </Group>
    </div>
  );
};

export default ProductGrid;
