import { useEffect, useState } from 'react';
import { Textarea, NumberInput, Button, Group, Tabs, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconInfoCircle, IconCarrot } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useUniqueCheck } from '../../../common/hooks/useUniqueCheck';
import UniqueTextField from '../../../common/components/UniqueTextField';
import ProductIngredientsManager from './ProductIngredientsManager';


const ProductForm = ({
  product = null,
  onSubmit,
  loading = false,
  submitLabel = "Create Product",
  showIngredientManagement = false,
  initialIngredients = [],
  onIngredientsChange,
}) => {
  
  const { 
    isAvailable, 
    isChecking, 
    checkAvailability 
  } = useUniqueCheck('productName', { minLength: 1, maxLength: 200 });
  const [ingredients, setIngredients] = useState(initialIngredients);
  const { t } = useTranslation(['common', 'products']);


  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      price: '',
    },
    validate: {
      name: (value) => {
        if (!value) return t('common:validation.required');
        if (value.length > 200) return t('common:validation.maxLength', { count: 200 });
        return null;
      },
      description: (value) => {
        if (value && value.length > 255) return t('common:validation.maxLength', { count: 255 });
        return null;
      },
      price: (value) => {
        if (value === '' || value === null) return t('common:validation.required');
        if (Number(value) < 0) return t('common:validation.positiveOrZero');
        return null;
      },
    },
    validateInputOnChange: true,
  });
  

  useEffect(() => {
    if (product) {
      form.setValues({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
      });
      setIngredients(product.ingredients || []);
    }
  }, [product]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkAvailability(form.values.name, product?.name);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [form.values.name]);

  // Notify ingredient change to parent if desired
  useEffect(() => {
    if (onIngredientsChange) onIngredientsChange(ingredients);
  }, [ingredients]);


  const handleAddIngredient = (food) => {
    if (!ingredients.some(i => i.foodId === food.id)) {
      setIngredients(prev => [...prev, { foodId: food.id, foodName: food.name, quantityInGrams: 1 }]);
    }
  };

  const handleUpdateIngredient = (foodId, quantity) => {
    setIngredients(prev =>
      prev.map(i => i.foodId === foodId ? { ...i, quantityInGrams: quantity } : i)
    );
  };

  const handleRemoveIngredient = (foodId) => {
    setIngredients(prev => prev.filter(i => i.foodId !== foodId));
  };

  const handleSubmit = async (values) => {
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
    await onSubmit({
      ...clean(values),
      ingredients,
    });
  };
  

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={loading} />
      <Tabs defaultValue="basic">
        <Tabs.List>
          <Tabs.Tab value="basic" leftSection={<IconInfoCircle size="0.8rem" />}>
            {t('common:form.basicInfo')}
          </Tabs.Tab>

          {showIngredientManagement && (
            <Tabs.Tab value="ingredients" leftSection={<IconCarrot size="0.8rem" />}>
              {t('products:form.ingredients')}
            </Tabs.Tab>
          )}
        </Tabs.List>
        <Tabs.Panel value="basic" pt="xs">
          <UniqueTextField
            label={t('products:form.name')}
            placeholder={t('products:form.namePlaceholder')}
            required
            isChecking={isChecking}
            isAvailable={isAvailable}
            {...form.getInputProps('name')}
            mb="md"
          />
          <Textarea
            label={t('products:form.description')}
            placeholder={t('products:form.descriptionPlaceholder')}
            autosize
            minRows={3}
            {...form.getInputProps('description')}
            mb="md"
          />
          <NumberInput
            label={t('products:form.price')}
            placeholder={t('products:form.pricePlaceholder')}
            required
            min={0}
            {...form.getInputProps('price')}
            mb="md"
          />
        </Tabs.Panel>

        {showIngredientManagement && (
          <Tabs.Panel value="ingredients" pt="xs">
            <ProductIngredientsManager
              productId={product?.id}
              ingredients={ingredients}
              onAddIngredient={handleAddIngredient}
              onUpdateIngredient={handleUpdateIngredient}
              onRemoveIngredient={handleRemoveIngredient}
              loading={loading}
            />
          </Tabs.Panel>
        )}
      </Tabs>
      <Group justify="flex-end" mt="xl">
        <Button 
          type="submit" 
          loading={loading}
          disabled={loading || isChecking || !isAvailable}
        >
          {submitLabel}
        </Button>
      </Group>
    </form>
  );
};

export default ProductForm;
