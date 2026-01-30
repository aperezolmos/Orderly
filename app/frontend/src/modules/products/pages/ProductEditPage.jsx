import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Text, Alert } from '@mantine/core';
import { IconAlertCircle, IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import FormLayout from '../../../common/layouts/FormLayout';
import ProductForm from '../components/ProductForm';
import { useProducts } from '../hooks/useProducts';
import { getNavigationConfig } from '../../../utils/navigationConfig';


const ProductEditPage = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentProduct,
    loading,
    error,
    updateProduct,
    loadProductById,
    clearError,
  } = useProducts();
  const { t } = useTranslation(['common', 'products']);


  useEffect(() => {
    if (id) loadProductById(Number.parseInt(id), { detailed: true, includeIngredients: true });
  }, [id, loadProductById]);

  const handleSubmit = async (productData) => {
    await updateProduct(Number.parseInt(id), productData);
    navigate('/products', { replace: true });
  };


  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'products');

  const breadcrumbs = [
    { title: t('products:management.list'), href: '/products' },
    { title: t('products:management.edit'), href: `/products/${id}/edit` }
  ];


  if (error && !loading) {
    return (
      <FormLayout
        title={t('products:management.edit')}
        icon={IconEdit}
        iconColor={moduleConfig?.color}
        breadcrumbs={breadcrumbs}
        showBackButton={true}
        error={error}
        onClearError={clearError}
      >
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title={t('products:errors.loadError')}
          color="red"
        >
          <Text mb="md">{t('products:errors.notFound', { id })}</Text>
          <Text size="sm" color="dimmed">
            {t('products:errors.notFoundDetails')}
          </Text>
        </Alert>
      </FormLayout>
    );
  }


  return (
    <FormLayout
      title={t('products:management.edit')}
      icon={IconEdit}
      iconColor={moduleConfig?.color}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={clearError}
    >
      <ProductForm
        product={currentProduct}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={t('products:form.update')}
        initialIngredients={currentProduct?.ingredients || []}
      />
    </FormLayout>
  );
};

export default ProductEditPage;
