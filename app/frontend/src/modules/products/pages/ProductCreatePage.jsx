import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { PERMISSIONS } from '../../../utils/permissions';
import FormLayout from '../../../common/layouts/FormLayout';
import ProductForm from '../components/ProductForm';
import { useProducts } from '../hooks/useProducts';
import { getNavigationConfig } from '../../../utils/navigationConfig';


const ProductCreatePage = () => {
  
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { createProduct, loading, error, clearError } = useProducts();
  const { t } = useTranslation(['common', 'products']);


  const handleSubmit = async (productData) => {
    await createProduct(productData);
    navigate('/products', { replace: true });
  };


  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'products');

  const breadcrumbs = [
    { title: t('products:management.list'), href: '/products' },
    { title: t('products:management.create'), href: '/products/new' }
  ];
  

  return (
    <FormLayout
      title={t('products:management.create')}
      icon={moduleConfig?.icon}
      iconColor={moduleConfig?.color}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={clearError}
    >
      <ProductForm
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={t('products:form.create')}
        showIngredientManagement={hasPermission(PERMISSIONS.PRODUCT_EDIT_INGREDIENTS)}
      />
    </FormLayout>
  );
};

export default ProductCreatePage;
