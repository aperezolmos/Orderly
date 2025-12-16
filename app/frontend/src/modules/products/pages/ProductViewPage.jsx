import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Title, Text, Group, Box, Button, LoadingOverlay } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import ProductNutritionInfoView from '../components/ProductNutritionInfoView';
import { productService } from '../../../services/backend/productService';
import { useTranslation } from 'react-i18next';


const ProductViewPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(['common', 'products', 'foods']);


  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const productData = await productService.getProductById(parseInt(id), { detailed: true, includeIngredients: true });
        setProduct(productData);
      } 
      catch (err) {
        setProduct(null);
        console.error('Error:', err);
      } 
      finally {
        setLoading(false);
      }
    };
    if (id) loadProduct();
  }, [id]);

  if (loading) {
    return (
      <ManagementLayout
        title={t('common:app.loading')}
        breadcrumbs={[]}
      >
        <Box style={{ height: '200px', position: 'relative' }}>
          <LoadingOverlay visible={true} />
        </Box>
      </ManagementLayout>
    );
  }

  if (!product) {
    return (
      <ManagementLayout
        title={t('products:management.view')}
        breadcrumbs={[
          { title: t('products:management.list'), href: '/products' },
          { title: t('products:management.view'), href: `/products/${id}/view` }
        ]}
      >
        <Text color="red">{t('products:errors.notFound', { id })}</Text>
      </ManagementLayout>
    );
  }


  return (
    <ManagementLayout
      title={t('products:management.view')}
      breadcrumbs={[
        { title: t('products:management.list'), href: '/products' },
        { title: product.name, href: `/products/${id}/view` }
      ]}
      showBackButton={true}
    >
      <Card shadow="sm" p="lg" radius="md" withBorder mb="md">
        <Group position="apart" mb="md">
          <Title order={3}>{product.name}</Title>
          <Button
            leftSection={<IconEdit size="1rem" />}
            onClick={() => navigate(`/products/${id}/edit`)}
          >
            {t('products:form.edit')}
          </Button>
        </Group>
        <Text mb="xs"><b>{t('products:form.description')}:</b> {product.description || '-'}</Text>
        <Text mb="xs"><b>{t('products:form.price')}:</b> {product.price} €</Text>
        <Text mb="xs"><b>{t('products:list.ingredientCount')}:</b> {product.ingredientCount}</Text>
      </Card>
      <ProductNutritionInfoView nutritionInfo={product.totalNutrition} />
      
      {/* Ingredient list */}
      <Card shadow="sm" p="md" radius="md" withBorder mt="md">
        <Title order={4} mb="sm">{t('products:ingredients.title')}</Title>
        {product.ingredients && product.ingredients.length > 0 ? (
          <ul>
            {product.ingredients.map(ing => (
              <li key={ing.foodId}>
                {ing.foodName} - {ing.quantityInGrams} g
              </li>
            ))}
          </ul>
        ) : (
          <Text color="dimmed">{t('products:ingredients.noIngredients')}</Text>
        )}
      </Card>
    </ManagementLayout>
  );
};

export default ProductViewPage;
