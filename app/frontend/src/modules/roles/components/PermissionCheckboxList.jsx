import { Checkbox, SimpleGrid, Title, Text, LoadingOverlay } from '@mantine/core';


const MAX_COLUMNS = 3;

const groupPermissionsInColumns = (permissions, columns) => {
  const perColumn = Math.ceil(permissions.length / columns);
  return Array.from({ length: columns }, (_, i) =>
    permissions.slice(i * perColumn, (i + 1) * perColumn)
  );
};


const PermissionCheckboxList = ({
  permissions = [],
  selected = [],
  onChange,
  loading = false,
  title,
  helpText
}) => {

  const columns = Math.min(MAX_COLUMNS, permissions.length);
  const permissionColumns = groupPermissionsInColumns(permissions, columns);


  const handleCheckboxChange = (perm, checked) => {
    if (checked) {
      onChange([...selected, perm]);
    } 
    else {
      onChange(selected.filter((p) => p !== perm));
    }
  };


  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={loading} />
      {title && <Title order={5} mb="sm">{title}</Title>}
      {helpText && <Text size="sm" color="dimmed" mb="md">{helpText}</Text>}
      <SimpleGrid cols={columns} spacing="md">
        {permissionColumns.map((group, colIdx) => (
          <div key={colIdx}>
            {group.map((perm) => (
              <Checkbox
                key={perm}
                label={perm}
                value={perm}
                checked={selected.includes(perm)}
                onChange={(event) => handleCheckboxChange(perm, event.currentTarget.checked)}
                mb="xs"
              />
            ))}
          </div>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default PermissionCheckboxList;
