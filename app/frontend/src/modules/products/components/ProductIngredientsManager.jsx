import React, { useState, useEffect } from 'react';
import { TextInput, Button, Group, Box, Loader } from '@mantine/core';
import { IconSearch, IconPlus } from '@tabler/icons-react';
import { foodService } from '../../../services/backend/foodService';
import ProductIngredientsTable from './ProductIngredientsTable';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


const ProductIngredientsManager = ({
  //productId,
  ingredients,
  onAddIngredient,
  onUpdateIngredient,
  onRemoveIngredient,
  loading,
}) => {
  
  const { t } = useTranslationWithLoading(['common', 'products', 'foods']);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (search.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    foodService.searchFoods(search)
      .then(results => setSearchResults(results))
      .finally(() => setSearching(false));
  }, [search]);

  const handleAdd = (food) => {
    onAddIngredient(food);
    setSearch('');
    setSearchResults([]);
  };
  

  return (
    <Box>
      <TextInput
        placeholder={t('products:ingredients.searchFood')}
        icon={<IconSearch size="1rem" />}
        value={search}
        onChange={e => setSearch(e.target.value)}
        mb="sm"
      />
      {searching && <Loader size="xs" />}
      {searchResults.length > 0 && (
        <Box mb="md">
          {searchResults.map(food => (
            <Group key={food.id} position="apart" mb={2}>
              <span>{food.name}</span>
              <Button
                size="xs"
                leftSection={<IconPlus size="0.8rem" />}
                onClick={() => handleAdd(food)}
                disabled={ingredients.some(i => i.foodId === food.id)}
              >
                {t('products:ingredients.add')}
              </Button>
            </Group>
          ))}
        </Box>
      )}
      <ProductIngredientsTable
        ingredients={ingredients}
        onUpdateIngredient={onUpdateIngredient}
        onRemoveIngredient={onRemoveIngredient}
        loading={loading}
      />
    </Box>
  );
};

export default ProductIngredientsManager;
