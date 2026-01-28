import { memo } from 'react';
import { Checkbox, SimpleGrid, Title, Text, LoadingOverlay,
         Group, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';


const PermissionCheckboxList = memo(({
  permissions = [],
  selected = [],
  onChange,
  loading = false
}) => {
  
  const { t } = useTranslation(['common', 'roles']);


  const allSelected = permissions.length > 0 && selected.length === permissions.length;
  const isIndeterminate = selected.length > 0 && selected.length < permissions.length;
  

  const handleSelectAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange([...permissions]);
    }
  };

  const handleCheckboxChange = (perm, checked) => {
    if (checked) {
      onChange([...selected, perm]);
    } else {
      onChange(selected.filter((p) => p !== perm));
    }
  };


  return (
    <div style={{ position: 'relative', minHeight: '100px' }}>
      <LoadingOverlay visible={loading} />
      
      <Group justify="space-between" align="flex-end" mb="md">
        <Stack gap={0}>
          <Title order={5}>{t('roles:form.permissions')}</Title>
          <Text size="sm" c="dimmed">{t('roles:form.permissionsHelp')}</Text>
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
        {permissions.map((perm) => (
          <Checkbox
            key={perm}
            label={perm}
            checked={selected.includes(perm)}
            onChange={(event) => handleCheckboxChange(perm, event.currentTarget.checked)}
          />
        ))}
      </SimpleGrid>
    </div>
  );
});

export default PermissionCheckboxList;
