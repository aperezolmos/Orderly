import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, LoadingOverlay } from '@mantine/core';
import FormLayout from '../../../common/layouts/FormLayout';
import ProductForm from '../components/ProductForm';
import { useProducts } from '../hooks/useProducts';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


const ProductCreatePage = () => {
  
  const navigate = useNavigate();
  const { createProduct, loading: createLoading } = useProducts();
  const [error, setError] = useState(null);
  const { t, ready, isNamespaceLoading } = useTranslationWithLoading(['common', 'products']);


  if (!ready || isNamespaceLoading) {
    return (
      <FormLayout
        title={t('common:app.loading')}
        breadcrumbs={[]}
        showBackButton={true}
      >
        <Box style={{ height: '200px', position: 'relative' }}>
          <LoadingOverlay visible={true} />
        </Box>
      </FormLayout>
    );
  }

  const handleSubmit = async (productData) => {
    try {
      setError(null);
      await createProduct(productData);
      navigate('/products', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const breadcrumbs = [
    { title: t('products:management.list'), href: '/products' },
    { title: t('products:management.create'), href: '/products/new' }
  ];
  

  return (
    <FormLayout
      title={t('products:management.create')}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={createLoading}
      error={error}
      onClearError={() => setError(null)}
    >
      <ProductForm
        onSubmit={handleSubmit}
        loading={createLoading}
        submitLabel={t('products:form.create')}
      />
    </FormLayout>
  );
};

export default ProductCreatePage;
