import React from 'react';
import { Checkbox, SimpleGrid, LoadingOverlay, Title, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';


const AllergenCheckboxList = ({
  allergens = [],
  selected = [],
  onChange,
  loading = false,
  columns = 3
}) => {
  
  const { t } = useTranslation(['foods']);

  const handleCheckboxChange = (allergen, checked) => {
    if (checked) {
      if (!selected.includes(allergen)) {
        onChange([...selected, allergen]);
      }
    } 
    else {
      onChange(selected.filter(a => a !== allergen));
    }
  };


  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={loading} />
      <Title order={5} mb="sm">{t('foods:allergens.form.title')}</Title>
      <Text size="sm" color="dimmed" mb="md">{t('foods:allergens.form.helpText')}</Text>
      <SimpleGrid cols={columns} spacing="md">
        {allergens.map((allergen) => (
          <Checkbox
            key={allergen}
            label={t(`foods:allergens.${allergen}`, allergen)}
            checked={selected.includes(allergen)}
            onChange={e => handleCheckboxChange(allergen, e.currentTarget.checked)}
            mb="xs"
          />
        ))}
      </SimpleGrid>
    </div>
  );
};

export default React.memo(AllergenCheckboxList);