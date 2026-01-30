import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import FormLayout from '../../../common/layouts/FormLayout';
import FoodForm from '../components/FoodForm';
import { useFoods } from '../hooks/useFoods';
import ExternalAPISearchTab from '../components/external/ExternalAPISearchTab';
import { getNavigationConfig } from '../../../utils/navigationConfig';


const FoodCreatePage = () => {
  
  const navigate = useNavigate();
  const { createFood, loading, error, clearError } = useFoods();
  const { t } = useTranslation(['common', 'foods']);
  const [activeTab, setActiveTab] = useState('manual');


  const handleSubmit = async (foodData) => {
    await createFood(foodData);
    navigate('/foods', { replace: true });
  };


  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'foods');

  const breadcrumbs = [
    { title: t('foods:management.list'), href: '/foods' },
    { title: t('foods:management.create'), href: '/foods/new' }
  ];


  return (
    <FormLayout
      title={t('foods:management.create')}
      icon={moduleConfig?.icon}
      iconColor={moduleConfig?.color}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={clearError}
    >
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="manual">{t('foods:create.manualTab')}</Tabs.Tab>
          <Tabs.Tab value="off">{t('foods:create.offTab')}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="manual" pt="xs">
          <FoodForm
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel={t('foods:form.create')}
          />
        </Tabs.Panel>
        <Tabs.Panel value="off" pt="xs">
          <Box mt="md">
            <ExternalAPISearchTab />
          </Box>
        </Tabs.Panel>
      </Tabs>
    </FormLayout>
  );
};

export default FoodCreatePage;
