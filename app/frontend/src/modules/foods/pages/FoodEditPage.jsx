import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Text, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import FormLayout from '../../../common/layouts/FormLayout';
import FoodForm from '../components/FoodForm';
import { foodService } from '../../../services/backend/foodService';
import { useTranslation } from 'react-i18next';


const FoodEditPage = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation(['common', 'foods']);

  useEffect(() => {
    const loadFood = async () => {
      try {
        setLoading(true);
        setError(null);
        const foodData = await foodService.getFoodById(parseInt(id));
        setFood(foodData);
      } 
      catch (err) {
        setError(err.message);
      } 
      finally {
        setLoading(false);
      }
    };
    if (id) loadFood();
  }, [id]);

  const handleSubmit = async (foodData) => {
    try {
      setSubmitting(true);
      setError(null);
      await foodService.updateFood(parseInt(id), foodData);
      navigate('/foods', { replace: true });
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
    { title: t('foods:management.list'), href: '/foods' },
    { title: t('foods:management.edit'), href: `/foods/${id}/edit` }
  ];


  if (error && !loading) {
    return (
      <FormLayout
        title={t('foods:management.edit')}
        breadcrumbs={breadcrumbs}
        showBackButton={true}
        error={error}
        onClearError={() => setError(null)}
      >
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title={t('foods:errors.loadError')}
          color="red"
        >
          <Text mb="md">{t('foods:errors.notFound', { id })}</Text>
          <Text size="sm" color="dimmed">
            {t('foods:errors.notFoundDetails')}
          </Text>
        </Alert>
      </FormLayout>
    );
  }


  return (
    <FormLayout
      title={t('foods:management.edit')}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={() => setError(null)}
    >
      <FoodForm
        food={food}
        onSubmit={handleSubmit}
        loading={submitting}
        submitLabel={t('foods:form.update')}
      />
    </FormLayout>
  );
};

export default FoodEditPage;
