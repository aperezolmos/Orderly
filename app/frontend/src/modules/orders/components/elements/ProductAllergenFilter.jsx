import { MultiSelect, Button, Group, Popover } from '@mantine/core';
import { IconFilterSearch } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ALLERGENS } from '../../../../utils/foodEnums';


const ProductAllergenFilter = ({
  value = [],
  onChange,
  onFilter,
  loading = false,
}) => {
  
  const { t } = useTranslation(['foods', 'orders']);


  return (
    <Popover width={300} position="bottom-end" withArrow shadow="md">
      <Popover.Target>
        <Button
          loading={loading}
          variant="outline"
          color="blue"
          leftSection={<IconFilterSearch size="1rem" />}
          title={t('foods:allergens.filter.filterAllergens')}
        >
          {t('foods:allergens.filter.filterButton')}
          {value.length > 0 && ` (${value.length})`}
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <MultiSelect
          data={ALLERGENS.map((a) => ({
            value: a.value,
            label: t(a.label),
          }))}
          value={value}
          onChange={onChange}
          label={t('foods:allergens.filter.filterAllergens')}
          placeholder={t('foods:allergens.filter.selectAllergens')}
          clearable
          searchable
          nothingFoundMessage={t('foods:allergens.filter.noAllergens')}
          maxDropdownHeight={200}
          comboboxProps={{ withinPortal: false }}
          disabled={loading}
        />
        
        <Button 
          fullWidth 
          mt="md" 
          size="xs" 
          onClick={onFilter}
          disabled={loading}
        >
          {t('foods:allergens.filter.filterButton')}
        </Button>
      </Popover.Dropdown>
    </Popover>
  );
};

export default ProductAllergenFilter;
