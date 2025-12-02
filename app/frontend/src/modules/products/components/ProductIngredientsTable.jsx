import React, { useState } from 'react';
import { Table, NumberInput, ActionIcon, Group, Text } from '@mantine/core';
import { IconTrash, IconCheck } from '@tabler/icons-react';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


const ProductIngredientsTable = ({
  ingredients,
  onUpdateIngredient,
  onRemoveIngredient,
  loading,
}) => {
  
  const { t } = useTranslationWithLoading(['products', 'foods']);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState(null);


  const startEdit = (ingredient) => {
    setEditId(ingredient.foodId);
    setEditValue(ingredient.quantityInGrams);
  };

  const saveEdit = (ingredient) => {
    if (editValue !== null && editValue !== ingredient.quantityInGrams) {
      onUpdateIngredient(ingredient.foodId, editValue);
    }
    setEditId(null);
    setEditValue(null);
  };
  

  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th>{t('products:ingredients.food')}</th>
          <th>{t('products:ingredients.quantity')}</th>
          <th>{t('products:ingredients.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {ingredients.length === 0 ? (
          <tr>
            <td colSpan={3}>
              <Text align="center" color="dimmed">
                {t('products:ingredients.noIngredients')}
              </Text>
            </td>
          </tr>
        ) : (
          ingredients.map(ingredient => (
            <tr key={ingredient.foodId}>
              <td>{ingredient.foodName}</td>
              <td>
                {editId === ingredient.foodId ? (
                  <Group spacing={2}>
                    <NumberInput
                      value={editValue}
                      onChange={setEditValue}
                      min={1}
                      step={1}
                      size="xs"
                      style={{ width: 90 }}
                    />
                    <ActionIcon
                      color="green"
                      onClick={() => saveEdit(ingredient)}
                      loading={loading}
                    >
                      <IconCheck size="1rem" />
                    </ActionIcon>
                  </Group>
                ) : (
                  <Group spacing={2}>
                    <Text>{ingredient.quantityInGrams} g</Text>
                    <ActionIcon
                      color="blue"
                      onClick={() => startEdit(ingredient)}
                      disabled={loading}
                    >
                      <IconCheck size="1rem" />
                    </ActionIcon>
                  </Group>
                )}
              </td>
              <td>
                <ActionIcon
                  color="red"
                  onClick={() => onRemoveIngredient(ingredient.foodId)}
                  disabled={loading}
                >
                  <IconTrash size="1rem" />
                </ActionIcon>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default ProductIngredientsTable;
