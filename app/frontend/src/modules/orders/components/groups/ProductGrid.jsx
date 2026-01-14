import { Grid, Group, Text, Pagination } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import ProductCard from '../elements/ProductCard';
import ProductCardSkeleton from '../elements/ProductCardSkeleton';
import { useOrderDashboardStore } from '../../store/orderDashboardStore';


const ProductGrid = () => {
  
  const {
    products,
    activePage,
    totalPages,
    isLoadingProducts,
    setActivePage,
    addProductToOrder,
  } = useOrderDashboardStore();

  const { t } = useTranslation(['orders']);


  //const categories = ['Food', 'Drink', 'Dessert']; // TODO: Ejemplo. Ajustar cuando haya categorías reales

  const skeletonCount = 8;


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
        {isLoadingProducts
          ? // Show skeletons while loading
            Array.from({ length: skeletonCount }).map((_, i) => (
              <Grid.Col key={`skeleton-${i}`} span={{ base: 6, sm: 4, md: 3, lg: 3 }}>
                <ProductCardSkeleton />
              </Grid.Col>
            ))
          : // Show actual products
            products.map((product) => (
              <Grid.Col key={product.id} span={{ base: 6, sm: 4, md: 3, lg: 3 }}>
                <ProductCard
                  product={product}
                  onSelect={() => addProductToOrder(product)}
                />
              </Grid.Col>
            ))}
      </Grid>
      {!isLoadingProducts && totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            value={activePage}
            onChange={setActivePage}
            total={totalPages}
            withEdges
          />
        </Group>
      )}
      {!isLoadingProducts && (
        <Group justify="center" mt="md">
          <Text size="sm" c="dimmed">
            {t('orders:dashboard.pageFooter', {
              page: activePage,
              totalPages,
              count: products.length,
            })}
          </Text>
        </Group>
      )}
    </div>
  );
};

export default ProductGrid;
