import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormLayout from '../../../common/layouts/FormLayout';
import FoodForm from '../components/FoodForm';
import { useFoods } from '../hooks/useFoods';
import { useTranslation } from 'react-i18next';


const FoodCreatePage = () => {
  
  const navigate = useNavigate();
  const { createFood, loading: createLoading } = useFoods();
  const [error, setError] = useState(null);
  const { t } = useTranslation(['common', 'foods']);


  const handleSubmit = async (foodData) => {
    try {
      setError(null);
      await createFood(foodData);
      navigate('/foods', { replace: true });
    } 
    catch (err) {
      setError(err.message);
    }
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
      loading={createLoading}
      error={error}
      onClearError={() => setError(null)}
    >
      <FoodForm
        onSubmit={handleSubmit}
        loading={createLoading}
        submitLabel={t('foods:form.create')}
      />
    </FormLayout>
  );
};

export default FoodCreatePage;
