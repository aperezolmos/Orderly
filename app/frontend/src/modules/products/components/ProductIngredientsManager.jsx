import { TextInput, ActionIcon, Group, Box, Loader, Text, 
         ScrollArea, Paper, Tooltip, Stack, Center} from '@mantine/core';
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


  const handleAdd = (food) => {
    onAddIngredient(food);
    clearSearch();
  };
  

  return (
    <Box>
      <TextInput
        placeholder={t('products:ingredients.searchFood')}
        leftSection={<IconSearch size="1.1rem" stroke={1.5} />}
        rightSection={searchLoading ? <Loader size="xs" /> : null}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        mb="xs"
      />

      {search.length >= 2 && (
        <Paper 
          withBorder 
          shadow="md" 
          mb="md" 
          style={{ 
            overflow: 'hidden',
            borderColor: 'var(--mantine-color-default-border)' 
          }}
        >
          <ScrollArea h={200} scrollbars="y" type="hover">
            <Stack gap={0}>
              {searchLoading && results.length === 0 ? (
                <Center py="xl">
                  <Loader size="sm" />
                </Center>
              ) : results.length > 0 ? (
                results.map((food) => {
                  const isAdded = ingredients.some((i) => i.foodId === food.id);
                  return (
                    <Group 
                      key={food.id} 
                      px="md" 
                      py="sm" 
                      justify="flex-start"
                      wrap="nowrap"
                      style={{
                        borderBottom: '1px solid var(--mantine-color-default-border)',
                        backgroundColor: isAdded ? 'var(--mantine-color-blue-light)' : 'transparent',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <Tooltip 
                        label={isAdded ? t('products:ingredients.alreadyAdded') : t('products:ingredients.add')} 
                        position="top"
                        withArrow
                      >
                        <ActionIcon
                          variant={isAdded ? "filled" : "light"}
                          color={isAdded ? "gray" : "blue"}
                          onClick={() => handleAdd(food)}
                          disabled={isAdded || tableLoading}
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
            </Stack>
          </ScrollArea>
        </Paper>
      )}

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
