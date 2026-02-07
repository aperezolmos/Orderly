import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Text, Alert } from '@mantine/core';
import { IconAlertCircle, IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import FormLayout from '../../../common/layouts/FormLayout';
import FoodForm from '../components/FoodForm';
import { useFoods } from '../hooks/useFoods';
import { getNavigationConfig } from '../../../utils/navigationConfig';


const FoodEditPage = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentFood,
    loading,
    error,
    updateFood,
    loadFoodById,
    clearError,
  } = useFoods();
  const { t } = useTranslation(['common', 'foods']);
  

  useEffect(() => {
    if (id) loadFoodById(Number.parseInt(id));
  }, [id, loadFoodById]);

  const handleSubmit = async (foodData) => {
    await updateFood(Number.parseInt(id), foodData);
    navigate('/foods', { replace: true });
  };


  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'foods');

  const breadcrumbs = [
    { title: t('foods:management.list'), href: '/foods' },
    { title: t('foods:management.edit'), href: `/foods/${id}/edit` }
  ];


  if (error && !loading) {
    return (
      <FormLayout
        title={t('foods:management.edit')}
        icon={IconEdit}
        iconColor={moduleConfig?.color}
        breadcrumbs={breadcrumbs}
        showBackButton={true}
        error={error}
        onClearError={clearError}
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
      icon={IconEdit}
      iconColor={moduleConfig?.color}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={clearError}
    >
      <FoodForm
        food={currentFood}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={t('foods:form.update')}
      />
    </FormLayout>
  );
};

export default FoodEditPage;
