import React, { useEffect, useState } from 'react';
import { TextInput, NumberInput, Button, Group, Tabs, LoadingOverlay, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';
import ProductIngredientsManager from './ProductIngredientsManager';


const ProductForm = ({
  product = null,
  onSubmit,
  loading = false,
  submitLabel = "Create Product",
  initialIngredients = [],
  onIngredientsChange,
}) => {
  
  const { t } = useTranslationWithLoading(['common', 'products']);
  const [ingredients, setIngredients] = useState(initialIngredients);


  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      price: '',
    },
    validate: {
      name: (value) => {
        if (!value) return t('products:validation.nameRequired');
        if (value.length > 100) return t('products:validation.nameMaxLength');
        return null;
      },
      description: (value) => {
        if (value && value.length > 255) return t('products:validation.descriptionMaxLength');
        return null;
      },
      price: (value) => {
        if (value === '' || value === null) return t('products:validation.priceRequired');
        if (Number(value) < 0) return t('products:validation.priceNonNegative');
        return null;
      },
    },
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
          <Tabs.Tab value="basic">{t('products:form.basicInfo')}</Tabs.Tab>
          <Tabs.Tab value="ingredients">{t('products:form.ingredients')}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="basic" pt="xs">
          <TextInput
            label={t('products:form.name')}
            placeholder={t('products:form.namePlaceholder')}
            required
            maxLength={100}
            {...form.getInputProps('name')}
            mb="md"
          />
          <TextInput
            label={t('products:form.description')}
            placeholder={t('products:form.descriptionPlaceholder')}
            maxLength={255}
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
      </Tabs>
      <Group position="right" mt="xl">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </Group>
    </form>
  );
};

export default ProductForm;
