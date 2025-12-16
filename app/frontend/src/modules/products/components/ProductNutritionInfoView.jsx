import { Card, Title, Group, Divider, Box, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';


const renderField = (label, value, unit = '', key = '') =>
  <Group key={key} spacing={4} mb={2}>
    <Text weight={500}>{label}:</Text>
    <Text>{value ?? '-'}</Text>
    {unit && <Text color="dimmed" size="sm">{unit}</Text>}
  </Group>;


const ProductNutritionInfoView = ({ nutritionInfo }) => {
  
  const { t } = useTranslation(['products', 'foods']);
  if (!nutritionInfo) return null;
  

  return (
    <Card shadow="sm" p="md" radius="md" withBorder>
      <Title order={4} mb="sm">{t('products:nutrition.title')}</Title>
      <Box>
        {renderField(t('foods:form.nutritionInfo.calories'), nutritionInfo.calories, 'kcal', 'calories')}
        {renderField(t('foods:form.nutritionInfo.carbohydrates'), nutritionInfo.carbohydrates, 'g', 'carbohydrates')}
        {renderField(t('foods:form.nutritionInfo.fats'), nutritionInfo.fats, 'g', 'fats')}
        {renderField(t('foods:form.nutritionInfo.fiber'), nutritionInfo.fiber, 'g', 'fiber')}
        {renderField(t('foods:form.nutritionInfo.protein'), nutritionInfo.protein, 'g', 'protein')}
        {renderField(t('foods:form.nutritionInfo.salt'), nutritionInfo.salt, 'g', 'salt')}
        {renderField(t('foods:form.nutritionInfo.saturatedFats'), nutritionInfo.saturatedFats, 'g', 'saturatedFats')}
        {renderField(t('foods:form.nutritionInfo.sugars'), nutritionInfo.sugars, 'g', 'sugars')}
      </Box>
      <Divider my="sm" />
      <Title order={5} mb="xs">{t('foods:form.minerals.title')}</Title>
      <Box>
        {Object.entries(nutritionInfo.minerals || {}).map(([key, value]) =>
          renderField(t(`foods:form.minerals.${key}`), value, 'mg', `minerals-${key}`)
        )}
      </Box>
      <Divider my="sm" />
      <Title order={5} mb="xs">{t('foods:form.vitamins.title')}</Title>
      <Box>
        {Object.entries(nutritionInfo.vitamins || {}).map(([key, value]) =>
          renderField(t(`foods:form.vitamins.${key}`), value, 'mg', `vitamins-${key}`)
        )}
      </Box>
    </Card>
  );
};

export default ProductNutritionInfoView;
