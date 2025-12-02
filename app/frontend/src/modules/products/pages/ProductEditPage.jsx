import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Text, Alert, Box, LoadingOverlay } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import FormLayout from '../../../common/layouts/FormLayout';
import ProductForm from '../components/ProductForm';
import { productService } from '../../../services/backend/productService';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


const ProductEditPage = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { t, ready, isNamespaceLoading } = useTranslationWithLoading(['common', 'products']);


  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productData = await productService.getProductById(parseInt(id), { detailed: true, includeIngredients: true });
        setProduct(productData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadProduct();
  }, [id]);

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
      setSubmitting(true);
      setError(null);
      await productService.updateProduct(parseInt(id), productData);
      navigate('/products', { replace: true });
    } 
    catch (err) {
      setError(err.message);
      throw err;
    } 
    finally {
      setSubmitting(false);
    }
  };

  const breadcrumbs = [
    { title: t('products:management.list'), href: '/products' },
    { title: t('products:management.edit'), href: `/products/${id}/edit` }
  ];


  if (error && !loading) {
    return (
      <FormLayout
        title={t('products:management.edit')}
        breadcrumbs={breadcrumbs}
        showBackButton={true}
        error={error}
        onClearError={() => setError(null)}
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
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={() => setError(null)}
    >
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        loading={submitting}
        submitLabel={t('products:form.update')}
        initialIngredients={product?.ingredients || []}
      />
    </FormLayout>
  );
};

export default ProductEditPage;
