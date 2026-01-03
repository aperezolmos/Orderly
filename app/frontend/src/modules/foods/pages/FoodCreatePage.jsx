import { useNavigate } from 'react-router-dom';
import FormLayout from '../../../common/layouts/FormLayout';
import FoodForm from '../components/FoodForm';
import { useFoods } from '../hooks/useFoods';
import { useTranslation } from 'react-i18next';


const FoodCreatePage = () => {
  
  const navigate = useNavigate();
  const { createFood, loading, error, clearError } = useFoods();
  const { t } = useTranslation(['common', 'foods']);


  const handleSubmit = async (foodData) => {
    await createFood(foodData);
    navigate('/foods', { replace: true });
  };

  const breadcrumbs = [
    { title: t('foods:management.list'), href: '/foods' },
    { title: t('foods:management.create'), href: '/foods/new' }
  ];


  return (
    <FormLayout
      title={t('foods:management.create')}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={clearError}
    >
      <FoodForm
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={t('foods:form.create')}
      />
    </FormLayout>
  );
};

export default FoodCreatePage;
