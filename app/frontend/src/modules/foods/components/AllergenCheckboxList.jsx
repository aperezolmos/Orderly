import { memo } from 'react';
import { Checkbox, SimpleGrid, Title, Text, LoadingOverlay, 
         Group, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';


const AllergenCheckboxList = memo(({
  allergens = [],
  selected = [],
  onChange,
  loading = false
}) => {
  
  const { t } = useTranslation(['common', 'foods']);


  const allSelected = allergens.length > 0 && selected.length === allergens.length;
  const isIndeterminate = selected.length > 0 && selected.length < allergens.length;


  const handleSelectAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange([...allergens]);
    }
  };

  const handleCheckboxChange = (allergen, checked) => {
    if (checked) {
      onChange([...selected, allergen]);
    } else {
      onChange(selected.filter(a => a !== allergen));
    }
  };


  return (
    <div style={{ position: 'relative', minHeight: '100px' }}>
      <LoadingOverlay visible={loading} />
      
      <Group justify="space-between" align="flex-end" mb="md">
        <Stack gap={0}>
          <Title order={5}>{t('foods:allergens.form.title')}</Title>
          <Text size="sm" c="dimmed">{t('foods:allergens.form.helpText')}</Text>
        </Stack>
        
        <Checkbox
          label={t('common:form.selectAll')}
          checked={allSelected}
          indeterminate={isIndeterminate}
          onChange={handleSelectAll}
          styles={{ label: { fontWeight: 600 } }}
        />
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {allergens.map((allergen) => (
          <Checkbox
            key={allergen}
            label={t(`foods:allergens.${allergen}`, allergen)}
            checked={selected.includes(allergen)}
            onChange={e => handleCheckboxChange(allergen, e.currentTarget.checked)}
          />
        ))}
      </SimpleGrid>
    </div>
  );
});

export default AllergenCheckboxList;
