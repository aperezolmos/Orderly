import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { PERMISSIONS } from '../../../utils/permissions';
import FormLayout from '../../../common/layouts/FormLayout';
import ProductForm from '../components/ProductForm';
import { useProducts } from '../hooks/useProducts';
import { getNavigationConfig } from '../../../utils/navigationConfig';


const ProductEditPage = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
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
        showIngredientManagement={hasPermission(PERMISSIONS.PRODUCT_EDIT_INGREDIENTS)}
        initialIngredients={currentProduct?.ingredients || []}
      />
    </FormLayout>
  );
};

export default ProductEditPage;
