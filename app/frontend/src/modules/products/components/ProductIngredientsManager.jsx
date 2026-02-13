import { TextInput, ActionIcon, Group, Box, Loader, Text, 
         ScrollArea, Paper, Tooltip, Stack, Center, Collapse } from '@mantine/core';
import { IconSearch, IconPlus, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useIngredientSearch } from '../hooks/useIngredientSearch';
import ProductIngredientsTable from './ProductIngredientsTable';


const ProductIngredientsManager = ({
  ingredients,
  onAddIngredient,
  onUpdateIngredient,
  onRemoveIngredient,
  loading: tableLoading,
}) => {
  
  const { 
    search, 
    setSearch, 
    results, 
    loading: searchLoading, 
    clearSearch 
  } = useIngredientSearch();
  const { t } = useTranslation(['products']);

  
  const showResultsPanel = search.trim().length >= 2;

  const handleAdd = (food) => {
    onAddIngredient(food);
    clearSearch();
  };
  

  return (
    <Box>
      <TextInput
        placeholder={t('products:ingredients.searchFood')}
        leftSection={<IconSearch size="1.1rem" stroke={1.5} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        mb="xs"
      />

      <Collapse in={showResultsPanel}>
        <Paper withBorder shadow="md" mb="md" style={{ overflow: 'hidden', minHeight: searchLoading ? 100 : 'auto' }}>
          <ScrollArea.Autosize mah={300} type="auto">
            <Stack gap={0} p="xs">
              
              {searchLoading ? (
                <Center py="xl">
                  <Loader size="md"/>
                </Center>
              ) : (
                <>
                  {results.length > 0 ? (
                    results.map((food) => {
                      const isAdded = ingredients.some(ing => ing.foodId === food.id);
                      
                      return (
                        <Group 
                          key={food.id} 
                          wrap="nowrap" 
                          p="xs" 
                          style={{ 
                            borderRadius: '4px',
                            borderBottom: '1px solid var(--mantine-color-default-border)'
                          }}
                        >
                          <Tooltip label={isAdded ? t('products:ingredients.alreadyAdded') : t('common:app.add')}>
                            <ActionIcon
                              variant={isAdded ? "light" : "subtle"}
                              color={isAdded ? "green" : "blue"}
                              onClick={() => !isAdded && handleAdd(food)}
                              radius="xl"
                              size="lg"
                            >
                              {isAdded ? <IconCheck size="1.1rem" /> : <IconPlus size="1.1rem" />}
                            </ActionIcon>
                          </Tooltip>
                          
                          <Box style={{ flex: 1 }}>
                            <Text size="sm" fw={600} c={isAdded ? 'dimmed' : 'inherit'}>
                              {food.name}
                            </Text>
                            {isAdded && (
                              <Text size="xs" c="blue.5" fs="italic">
                                {t('products:ingredients.inList')}
                              </Text>
                            )}
                          </Box>
                        </Group>
                      );
                    })
                  ) : (
                    <Center py="xl">
                      <Group gap="xs" c="dimmed">
                        <IconAlertCircle size="1.2rem" />
                        <Text size="sm">{t('products:ingredients.noResults')}</Text>
                      </Group>
                    </Center>
                  )}
                </>
              )}
            </Stack>
          </ScrollArea.Autosize>
        </Paper>
      </Collapse>

      <ProductIngredientsTable
        ingredients={ingredients}
        onUpdateIngredient={onUpdateIngredient}
        onRemoveIngredient={onRemoveIngredient}
        loading={tableLoading}
      />
    </Box>
  );
};

export default ProductIngredientsManager;
