import { useEffect, useMemo } from 'react';
import { TextInput, NumberInput, Button, Group,
         Select, LoadingOverlay, Tabs } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import NutritionInfoForm from './NutritionInfoForm';
import AllergenCheckboxList from './AllergenCheckboxList';
import { FOOD_GROUPS } from '../../../utils/foodEnums'
import { useFoods } from '../hooks/useFoods'


const FoodForm = ({
  food = null,
  onSubmit,
  loading = false,
  submitLabel = "Create Food"
}) => {
  
  const { getAllAllergens, allergens: availableAllergens, loading: allergensLoading } = useFoods();
  const { t } = useTranslation(['common', 'foods']);


  // Memoize translated options so they are stable between renders
  const foodGroupOptions = useMemo(
    () => FOOD_GROUPS.map(g => ({ value: g.value, label: t(g.label) })),
    [t]
  );

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
      },
      allergenInfo: {
        allergens: []
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
    getAllAllergens();
  }, [getAllAllergens]);

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
        },
        allergenInfo: {
          allergens: food.allergenInfo?.allergens || []
        }
      });
    }
  }, [food]);
  

  const handleSubmit = async (values) => {
    // Clean up empty strings to null, but preserve arrays
    const clean = (obj) => {
      if (obj === null || obj === undefined) return obj;
      if (Array.isArray(obj)) {
        // keep non-empty items (filter out empty string/undefined)
        return obj
          .filter(v => v !== '' && v !== undefined && v !== null)
          .map(v => (typeof v === 'object' ? clean(v) : v));
      }
      if (typeof obj !== 'object') return obj;
      const out = {};
      for (const k in obj) {
        const v = obj[k];
        if (v === '' || v === undefined) continue;
        if (typeof v === 'object' && v !== null) {
          const nested = clean(v);
          if (Array.isArray(nested) ? nested.length > 0 : Object.keys(nested).length > 0) out[k] = nested;
        } else {
          out[k] = v;
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
          <Tabs.Tab value="allergens">{t('foods:allergens.form.title')}</Tabs.Tab>
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
              data={foodGroupOptions}
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

        <Tabs.Panel value="allergens" pt="xs">
          <AllergenCheckboxList
            allergens={availableAllergens || []}
            selected={form.values.allergenInfo?.allergens || []}
            onChange={(selected) => form.setFieldValue('allergenInfo.allergens', selected)}
            loading={allergensLoading}
          />
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
