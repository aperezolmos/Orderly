import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Title, Text, Group, Box, Button,
         LoadingOverlay, ScrollArea } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import ProductNutritionInfoView from '../components/ProductNutritionInfoView';
import { useProducts } from '../hooks/useProducts';
import ProductIngredientCard from '../components/ProductIngredientCard';
import AllergensList from '../components/AllergensList';
import { getNavigationConfig } from '../../../utils/navigationConfig';
import { useAuth } from '../../../context/AuthContext';
import { PERMISSIONS } from '../../../utils/permissions';


const ProductViewPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const {
    currentProduct,
    loading,
    error,
    loadProductById,
  } = useProducts();
  const { t } = useTranslation(['common', 'products', 'foods']);


  useEffect(() => {
    if (id) loadProductById(Number.parseInt(id), { detailed: true, includeIngredients: true });
  }, [id, loadProductById]);


  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'products');


  if (loading) {
    return (
      <ManagementLayout
        title={t('products:management.view')}
        icon={moduleConfig?.icon}
        iconColor={moduleConfig?.color}
        breadcrumbs={[]}
      >
        <Box style={{ height: '200px', position: 'relative' }}>
          <LoadingOverlay visible={true} />
        </Box>
      </ManagementLayout>
    );
  }

  if (error || !currentProduct) {
    return (
      <ManagementLayout
        title={t('products:management.view')}
        icon={moduleConfig?.icon}
        iconColor={moduleConfig?.color}
        breadcrumbs={[
          { title: t('products:management.list'), href: '/products' },
          { title: t('products:management.view'), href: `/products/${id}/view` }
        ]}
      >
        <Text color="red">{t('products:errors.notFound', { id })}</Text>
      </ManagementLayout>
    );
  }

  const product = currentProduct;
  

  return (
    <ManagementLayout
      title={t('products:management.view')}
      icon={moduleConfig?.icon}
      iconColor={moduleConfig?.color}
      breadcrumbs={[
        { title: t('products:management.list'), href: '/products' },
        { title: product.name, href: `/products/${id}/view` }
      ]}
      showBackButton={true}
    >
      <Card shadow="sm" p="lg" radius="md" withBorder mb="md">
        <Group justify="space-between" mb="md">
          <Title order={3}>{product.name}</Title>
          <Button
            leftSection={<IconEdit size="1rem" />}
            onClick={() => navigate(`/products/${id}/edit`)}
            disabled={!hasPermission(PERMISSIONS.PRODUCT_EDIT)}
          >
            {t('products:form.edit')}
          </Button>
        </Group>
        
        <Text mb="xs"><b>{t('products:form.description')}:</b> {product.description || '-'}</Text>
        <Text mb="xs"><b>{t('products:form.price')}:</b> {product.price} €</Text>
        <Text mb="xs"><b>{t('products:list.ingredientCount')}:</b> {product.ingredientCount}</Text>
        
        <Box mt="sm" mb="xs" style={{ maxWidth: '300px' }}>
          <AllergensList 
            allergenInfo={product.allergenInfo} 
            idSuffix={`prod-${product.id}`} 
          />
        </Box>

      </Card>
      
      <ProductNutritionInfoView nutritionInfo={product.totalNutrition} />
      
      {/* Ingredient list */}
      <Box mt="xl">
      <Title order={4} mb="sm">{t('products:ingredients.title')}</Title>
      
      <ScrollArea h={400} type="auto" offsetScrollbars>
        <Box 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px', 
            paddingRight: '4px' 
          }}
        >
          {product.ingredients && product.ingredients.length > 0 ? (
            product.ingredients.map((ing) => (
              <ProductIngredientCard key={ing.foodId} ingredient={ing} />
            ))
          ) : (
            <Text color="dimmed" fs="italic">{t('products:ingredients.noIngredients')}</Text>
          )}
        </Box>
      </ScrollArea>
    </Box>
    </ManagementLayout>
  );
};

export default ProductViewPage;
