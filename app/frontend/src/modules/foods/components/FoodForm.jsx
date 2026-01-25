import { useEffect, useState, useRef, useMemo } from 'react';
import { TextInput, NumberInput, Button, Group, Select, LoadingOverlay, Tabs } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import NutritionInfoForm from './NutritionInfoForm';
import AllergenCheckboxList from './AllergenCheckboxList';
import { FOOD_GROUPS } from '../../../utils/foodEnums';
import { useFoods } from '../hooks/useFoods';


const FoodForm = ({
  food = null,
  onSubmit,
  loading = false,
  submitLabel = "Create Food"
}) => {
  
  const { getAllAllergens, allergens: availableAllergens, loading: allergensLoading } = useFoods();
  const { t } = useTranslation(['common', 'foods']);


  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const initialAllergensRef = useRef([]);

  const foodGroupOptions = useMemo(
    () => FOOD_GROUPS.map(g => ({ value: g.value, label: t(g.label) })),
    [t]
  );


  const form = useForm({
    initialValues: {
      id: null,
      name: '',
      foodGroup: '',
      servingWeightGrams: '',
      nutritionInfo: {
        calories: '', carbohydrates: '', fats: '', fiber: '',
        protein: '', salt: '', saturatedFats: '', sugars: '',
        minerals: { calcium: '', iron: '', magnesium: '', phosphorus: '', 
          potassium: '', selenium: '', sodium: '', zinc: '' },
        vitamins: { vitaminA: '', vitaminC: '', vitaminD: '', vitaminE: '', vitaminB1: '', 
          vitaminB2: '', vitaminB3: '', vitaminB6: '', vitaminB9: '', vitaminB12: '' }
      }
    },
    validate: {
      foodGroup: (value) => (value ? null : t('common:validation.required')),
      servingWeightGrams: (value) => (value < 1 ? t('common:validation.positive') : null),
    },
  });


  useEffect(() => {
    getAllAllergens();
  }, [getAllAllergens]);

  useEffect(() => {
    if (food) {
      form.setInitialValues(food);
      form.setValues(food);
      
      const foodAllergens = food.allergenInfo?.allergens || [];
      setSelectedAllergens(foodAllergens);
      initialAllergensRef.current = foodAllergens;
    }
  }, [food]);


  
  const allergensDirty = useMemo(() => {
    const start = [...initialAllergensRef.current].sort().join(',');
    const current = [...selectedAllergens].sort().join(',');
    return start !== current;
  }, [selectedAllergens]);


  const handleSubmit = (values) => {
    const payload = {
      ...values,
      allergenInfo: {
        allergens: selectedAllergens
      }
    };
    onSubmit(payload);
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

        <Tabs.Panel value="basic" pt="md">
          <TextInput
            label={t('foods:form.name')}
            placeholder={t('foods:form.namePlaceholder')}
            required
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

        <Tabs.Panel value="nutrition" pt="md">
          <NutritionInfoForm form={form} />
        </Tabs.Panel>

        <Tabs.Panel value="allergens" pt="md">
          <AllergenCheckboxList
            allergens={availableAllergens}
            selected={selectedAllergens}
            onChange={setSelectedAllergens}
            loading={allergensLoading}
          />
        </Tabs.Panel>
      </Tabs>

      <Group justify="flex-end" mt="xl">
        <Button 
          type="submit" 
          loading={loading}
          disabled={!form.isDirty() && !allergensDirty}
        >
          {submitLabel}
        </Button>
      </Group>
    </form>
  );
};

export default FoodForm;
