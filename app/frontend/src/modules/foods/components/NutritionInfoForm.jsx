import { memo } from 'react';
import { NumberInput, Divider, Title, Box, SimpleGrid } from '@mantine/core';
import { useTranslation } from 'react-i18next';


// Atomic component that does not cause re-renders on the main form when writing
const OptimizedNumberInput = memo(({ label, initialValue, onCommit }) => {
  return (
    <NumberInput
      label={label}
      defaultValue={initialValue ?? ''}
      // The form is only notified when the user finishes typing (onBlur)
      onBlur={(e) => {
        const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
        onCommit(val);
      }}
      min={0}
      max={9999.99}
      decimalScale={2}
      // thousandSeparator=" "
    />
  );
});


const MineralsFields = memo(({ values, onFieldChange, foodId }) => {
  
  const { t } = useTranslation(['foods']);
  const keys = ['calcium', 'iron', 'magnesium', 'phosphorus', 'potassium', 'selenium', 'sodium', 'zinc'];
  
  return (
    <Box key={`minerals-${foodId}`}>
      <Title order={5} mb="xs">{t('foods:form.minerals.title')}</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        {keys.map(key => (
          <OptimizedNumberInput
            key={key}
            label={t(`foods:form.minerals.${key}`)}
            initialValue={values?.[key]}
            onCommit={(val) => onFieldChange('minerals', key, val)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
});

const VitaminsFields = memo(({ values, onFieldChange, foodId }) => {
  
  const { t } = useTranslation(['foods']);
  const keys = ['vitaminA', 'vitaminC', 'vitaminD', 'vitaminE', 'vitaminB1', 
                'vitaminB2', 'vitaminB3', 'vitaminB6', 'vitaminB9', 'vitaminB12'];

  return (
    <Box key={`vitamins-${foodId}`}>
      <Title order={5} mb="xs">{t('foods:form.vitamins.title')}</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        {keys.map(key => (
          <OptimizedNumberInput
            key={key}
            label={t(`foods:form.vitamins.${key}`)}
            initialValue={values?.[key]}
            onCommit={(val) => onFieldChange('vitamins', key, val)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
});


const NutritionInfoForm = ({ form }) => {
  
  const { t } = useTranslation(['foods']);
  
  // Unique id to force reset of defaultValues ​​when changing food
  const foodId = form.values.id || 'new';

  const handleFieldChange = (field, value) => {
    form.setFieldValue(`nutritionInfo.${field}`, value);
  };

  const handleNestedChange = (group, field, value) => {
    form.setFieldValue(`nutritionInfo.${group}.${field}`, value);
  };

  const mainMetrics = [
    'calories', 'carbohydrates', 'fats', 'fiber', 
    'protein', 'salt', 'saturatedFats', 'sugars'
  ];


  return (
    <Box>
      <Title order={4} mb="sm">{t('foods:form.nutritionInfo.title')}</Title>
      
      <Box key={`macros-${foodId}`} mb="md">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          {mainMetrics.map(key => (
            <OptimizedNumberInput 
              key={key}
              label={t(`foods:form.nutritionInfo.${key}`)} 
              initialValue={form.values.nutritionInfo[key]}
              onCommit={(val) => handleFieldChange(key, val)}
            />
          ))}
        </SimpleGrid>
      </Box>
      
      <Divider my="md" label={t('foods:form.minerals.title')} labelPosition="center" />
      <MineralsFields 
        foodId={foodId}
        values={form.values.nutritionInfo.minerals} 
        onFieldChange={handleNestedChange} 
      />
      
      <Divider my="md" label={t('foods:form.vitamins.title')} labelPosition="center" />
      <VitaminsFields 
        foodId={foodId}
        values={form.values.nutritionInfo.vitamins} 
        onFieldChange={handleNestedChange} 
      />
    </Box>
  );
};

export default NutritionInfoForm;
