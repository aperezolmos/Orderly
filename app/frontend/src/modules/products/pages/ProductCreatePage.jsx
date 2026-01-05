import { useNavigate } from 'react-router-dom';
import FormLayout from '../../../common/layouts/FormLayout';
import ProductForm from '../components/ProductForm';
import { useProducts } from '../hooks/useProducts';
import { useTranslation } from 'react-i18next';


const ProductCreatePage = () => {
  
  const navigate = useNavigate();
  const { createProduct, loading, error, clearError } = useProducts();
  const { t } = useTranslation(['common', 'products']);


  const handleSubmit = async (productData) => {
    await createProduct(productData);
    navigate('/products', { replace: true });
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
      loading={loading}
      error={error}
      onClearError={clearError}
    >
      <ProductForm
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={t('products:form.create')}
      />
    </FormLayout>
  );
};

export default ProductCreatePage;
