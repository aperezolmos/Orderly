import { memo } from 'react';
import { Checkbox, Box, Title, Text, LoadingOverlay,
         Group, Stack, useMatches } from '@mantine/core';
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

  const columnCount = useMatches({ base: 1, sm: 2, lg: 3 });


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

      <Box
        style={{
          columnCount: columnCount,
          columnGap: 'var(--mantine-spacing-md)',
        }}
      >
        {permissions.map((perm) => (
          <Box 
            key={perm} 
            mb="sm" 
            style={{ 
              breakInside: 'avoid',
              display: 'block' 
            }}
          >
            <Checkbox
              label={perm}
              checked={selected.includes(perm)}
              onChange={(event) => handleCheckboxChange(perm, event.currentTarget.checked)}
            />
          </Box>
        ))}
      </Box>
    </div>
  );
});

export default PermissionCheckboxList;
