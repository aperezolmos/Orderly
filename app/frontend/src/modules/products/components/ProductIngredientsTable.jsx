import { useState } from 'react';
import { Table, NumberInput, ActionIcon, Group, Text } from '@mantine/core';
import { IconTrash, IconCheck, IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';


const ProductIngredientsTable = ({
  ingredients,
  onUpdateIngredient,
  onRemoveIngredient,
  loading,
}) => {
  
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState(null);
  const { t } = useTranslation(['products', 'foods', 'common']);

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
    <Table.ScrollContainer minWidth={600}>
      <Table striped highlightOnHover withTableBorder horizontalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('products:ingredients.food')}</Table.Th>
            <Table.Th style={{ width: '200px' }}>{t('products:ingredients.quantity')}</Table.Th>
            <Table.Th style={{ width: '100px' }}>
               <Text size="sm" fw={700} ta="center">
                {t('common:navigation.actions')}
              </Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {ingredients.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={3}>
                <Text align="center" c="dimmed" py="xl">
                  {t('products:ingredients.noIngredients')}
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            ingredients.map((ingredient) => (
              <Table.Tr key={ingredient.foodId}>
                <Table.Td fw={500}>{ingredient.foodName}</Table.Td>
                <Table.Td>
                  <div style={{ minHeight: '30px', display: 'flex', alignItems: 'center' }}>
                    {editId === ingredient.foodId ? (
                      <Group gap="xs" wrap="nowrap">
                        <NumberInput
                          value={editValue}
                          onChange={setEditValue}
                          min={1}
                          size="xs"
                          style={{ width: 65 }}
                        />
                        <ActionIcon
                          variant="light"
                          color="green"
                          onClick={() => saveEdit(ingredient)}
                          loading={loading}
                        >
                          <IconCheck size="1rem" />
                        </ActionIcon>
                      </Group>
                    ) : (
                      <Group gap="xs" wrap="nowrap">
                        <Text size="sm" style={{ width: 65 }}>
                          {ingredient.quantityInGrams} g
                        </Text>
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => startEdit(ingredient)}
                          disabled={loading}
                        >
                          <IconEdit size="1rem" />
                        </ActionIcon>
                      </Group>
                    )}
                  </div>
                </Table.Td>
                <Table.Td>
                  <Group justify="center">
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => onRemoveIngredient(ingredient.foodId)}
                      disabled={loading}
                    >
                      <IconTrash size="1rem" />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};

export default ProductIngredientsTable;
