import { useEffect } from 'react';
import { TextInput, NumberInput, Button, Group, Select, LoadingOverlay, Tabs } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import NutritionInfoForm from './NutritionInfoForm';


const FOOD_GROUPS = [
  { value: 'DAIRY', label: 'foods:foodGroups.DAIRY' },
  { value: 'PROTEINS', label: 'foods:foodGroups.PROTEINS' },
  { value: 'FRUIT', label: 'foods:foodGroups.FRUIT' },
  { value: 'VEGETABLES', label: 'foods:foodGroups.VEGETABLES' },
  { value: 'GRAINS', label: 'foods:foodGroups.GRAINS' },
  { value: 'FATS', label: 'foods:foodGroups.FATS' },
  { value: 'LEGUMES', label: 'foods:foodGroups.LEGUMES' },
  { value: 'COMBINATION', label: 'foods:foodGroups.COMBINATION' },
  { value: 'NOT_APPLICABLE', label: 'foods:foodGroups.NOT_APPLICABLE' },
];


const FoodForm = ({
  food = null,
  onSubmit,
  loading = false,
  submitLabel = "Create Food"
}) => {
  
  const { t } = useTranslation(['common', 'foods']);


  const form = useForm({
    initialValues: {
      name: '',
      foodGroup: '',
      servingWeightGrams: '',
      nutritionInfo: {
        calories: '',
        carbohydrates: '',
        fats: '',
        fiber: '',
        protein: '',
        salt: '',
        saturatedFats: '',
        sugars: '',
        minerals: {
          calcium: '',
          iron: '',
          magnesium: '',
          phosphorus: '',
          potassium: '',
          selenium: '',
          sodium: '',
          zinc: '',
        },
        vitamins: {
          vitaminA: '',
          vitaminC: '',
          vitaminD: '',
          vitaminE: '',
          vitaminB1: '',
          vitaminB2: '',
          vitaminB3: '',
          vitaminB6: '',
          vitaminB9: '',
          vitaminB12: '',
        }
      }
    },
    validate: {
      name: (value) => {
        if (!value) return t('common:validation.required');
        if (value.length > 100) return t('common:validation.maxLength', { count: 100 });
        return null;
      },
      foodGroup: (value) => (!value ? t('common:validation.required') : null),
      servingWeightGrams: (value) => {
        if (!value) return t('common:validation.required');
        if (Number(value) <= 0) return t('common:validation.positive');
        return null;
      },
    },
  });

  useEffect(() => {
    if (food) {
      form.setValues({
        name: food.name || '',
        foodGroup: food.foodGroup || '',
        servingWeightGrams: food.servingWeightGrams || '',
        nutritionInfo: {
          ...food.nutritionInfo,
          minerals: { ...food.nutritionInfo?.minerals },
          vitamins: { ...food.nutritionInfo?.vitamins },
        }
      });
    }
  }, [food]);

  const handleSubmit = async (values) => {
    // Clean up empty strings to null
    const clean = (obj) => {
      if (typeof obj !== 'object' || obj === null) return obj;
      const out = {};
      for (const k in obj) {
        if (obj[k] === '' || obj[k] === undefined) continue;
        if (typeof obj[k] === 'object' && obj[k] !== null) {
          const nested = clean(obj[k]);
          if (Object.keys(nested).length > 0) out[k] = nested;
        } else {
          out[k] = obj[k];
        }
      }
      return out;
    };
    await onSubmit(clean(values));
  };
  

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={loading} />
      <Tabs defaultValue="basic">
        <Tabs.List>
          <Tabs.Tab value="basic">{t('common:form.basicInfo')}</Tabs.Tab>
          <Tabs.Tab value="nutrition">{t('foods:form.nutritionInfo.title')}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="basic" pt="xs">
          <TextInput
            label={t('foods:form.name')}
            placeholder={t('foods:form.namePlaceholder')}
            required
            maxLength={100}
            {...form.getInputProps('name')}
            mb="md"
          />
          <Group grow mb="md">
            <Select
              label={t('foods:form.foodGroup')}
              placeholder={t('foods:form.foodGroupPlaceholder')}
              required
              data={FOOD_GROUPS.map(g => ({
                value: g.value,
                label: t(g.label)
              }))}
              {...form.getInputProps('foodGroup')}
            />
            <NumberInput
              label={t('foods:form.servingWeightGrams')}
              placeholder={t('foods:form.servingWeightPlaceholder')}
              required
              min={1}
              {...form.getInputProps('servingWeightGrams')}
            />
          </Group>
        </Tabs.Panel>
        <Tabs.Panel value="nutrition" pt="xs">
          <NutritionInfoForm form={form} />
        </Tabs.Panel>
      </Tabs>
      <Group position="right" mt="xl">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </Group>
    </form>
  );
};

export default FoodForm;
