import { useMemo } from 'react';
import { Grid, Group, Text, Pagination } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import ProductCard from '../elements/ProductCard';
import ProductCardSkeleton from '../elements/ProductCardSkeleton';
import { useOrderDashboardStore } from '../../store/orderDashboardStore';
import { useAuth } from '../../../../context/AuthContext';
import { PERMISSIONS } from '../../../../utils/permissions';
import ProductAllergenFilter from '../elements/ProductAllergenFilter';
import { usePagination } from '../../../../common/hooks/usePagination';


const PAGE_SIZE = 12;


const ProductGrid = () => {
  
  const {
    products,
    isLoadingProducts,
    allergenFilter,
    setAllergenFilter,
    fetchFilteredProducts,
    orderType,
  } = useOrderDashboardStore();
  const { hasPermission } = useAuth();
  const { t } = useTranslation(['orders']);

  
  const pagination = usePagination(products, PAGE_SIZE);
  const paginatedProducts = useMemo(() => pagination.paginatedData, [pagination.paginatedData]);
  const skeletonCount = PAGE_SIZE;


  return (
    <div className="product-grid" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      
      <Group justify="flex-end" mb="md">
        <ProductAllergenFilter
          value={allergenFilter}
          onChange={setAllergenFilter}
          onFilter={() => fetchFilteredProducts()}
          loading={isLoadingProducts}
        />
      </Group>

      <div style={{ flex: 1 }}>
        <Grid gutter="md">
          {isLoadingProducts
            ? // Show skeletons while loading
              Array.from({ length: skeletonCount }).map((_, i) => (
                <Grid.Col key={`skeleton-${i}`} span={{ base: 12, xs: 6, sm: 4, md: 4, lg: 4 }}>
                  <ProductCardSkeleton />
                </Grid.Col>
              ))
            : // Show actual products
              paginatedProducts.map((product) => (
                <Grid.Col key={product.id} span={{ base: 12, xs: 6, sm: 4, md: 4, lg: 4 }}>
                  <ProductCard
                    product={product}
                    onSelect={() => {
                      if (hasPermission(PERMISSIONS.ORDER_EDIT)) {
                        useOrderDashboardStore.getState().addProductToOrder(product);
                        return;
                      }
                      if (orderType === 'bar') {
                        if (hasPermission(PERMISSIONS.ORDER_BAR_EDIT)) {
                          useOrderDashboardStore.getState().addProductToOrder(product);
                        }
                        return;
                      }
                      if (orderType === 'dining') {
                        if (hasPermission(PERMISSIONS.ORDER_DINING_EDIT)) {
                          useOrderDashboardStore.getState().addProductToOrder(product);
                        }
                        return;
                      }
                    }}
                  />
                </Grid.Col>
              ))}
        </Grid>
      </div>
      

      <div style={{ marginTop: 'auto' }}>
        {!isLoadingProducts && pagination.totalPages > 1 && (
          <Group justify="center" mt="xl">
            <Pagination
              value={pagination.activePage}
              onChange={pagination.setPage}
              total={pagination.totalPages}
              withEdges
            />
          </Group>
        )}
        {!isLoadingProducts && (
          <Group justify="center" mt="md">
            <Text size="sm" c="dimmed">
              {t('orders:dashboard.pageFooter', {
                page: pagination.activePage,
                totalPages: pagination.totalPages,
                count: products.length,
              })}
            </Text>
          </Group>
        )}
      </div>
      
    </div>
  );
};

export default ProductGrid;
