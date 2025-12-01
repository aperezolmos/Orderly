import React from 'react';
import { Card, Title, Group, Divider, Box, Text } from '@mantine/core';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


const renderField = (label, value, unit = '') =>
  <Group spacing={4} mb={2}>
    <Text weight={500}>{label}:</Text>
    <Text>{value ?? '-'}</Text>
    {unit && <Text color="dimmed" size="sm">{unit}</Text>}
  </Group>;


const ProductNutritionInfoView = ({ nutritionInfo }) => {
  
  const { t } = useTranslationWithLoading(['products', 'foods']);
  if (!nutritionInfo) return null;
  

  return (
    <Card shadow="sm" p="md" radius="md" withBorder>
      <Title order={4} mb="sm">{t('products:nutrition.title')}</Title>
      <Box>
        {renderField(t('foods:form.calories'), nutritionInfo.calories, 'kcal')}
        {renderField(t('foods:form.carbohydrates'), nutritionInfo.carbohydrates, 'g')}
        {renderField(t('foods:form.fats'), nutritionInfo.fats, 'g')}
        {renderField(t('foods:form.fiber'), nutritionInfo.fiber, 'g')}
        {renderField(t('foods:form.protein'), nutritionInfo.protein, 'g')}
        {renderField(t('foods:form.salt'), nutritionInfo.salt, 'g')}
        {renderField(t('foods:form.saturatedFats'), nutritionInfo.saturatedFats, 'g')}
        {renderField(t('foods:form.sugars'), nutritionInfo.sugars, 'g')}
      </Box>
      <Divider my="sm" />
      <Title order={5} mb="xs">{t('foods:form.minerals')}</Title>
      <Box>
        {Object.entries(nutritionInfo.minerals || {}).map(([key, value]) =>
          renderField(t(`foods:form.${key}`), value, 'mg')
        )}
      </Box>
      <Divider my="sm" />
      <Title order={5} mb="xs">{t('foods:form.vitamins')}</Title>
      <Box>
        {Object.entries(nutritionInfo.vitamins || {}).map(([key, value]) =>
          renderField(t(`foods:form.${key}`), value, 'mg')
        )}
      </Box>
    </Card>
  );
};

export default ProductNutritionInfoView;
