import { memo } from 'react';
import { Group, Badge, Paper, Title, Text, ScrollArea, SimpleGrid } from '@mantine/core';
import { IconX, IconPlus, IconShieldCheck, IconShieldPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';


const RoleTransferList = memo(({
  assignedRoles = [],
  availableRoles = [],
  onAddRole,
  onRemoveRole,
  loading = false
}) => {
  
  const { t } = useTranslation(['common', 'roles']);

  
  const RoleItem = ({ role, isAssigned }) => (
    <Badge
      key={role.id}
      size="lg"
      variant={isAssigned ? "filled" : "outline"}
      color={isAssigned ? "blue" : "gray"}
      rightSection={
        isAssigned ? (
          <IconX size="0.8rem" style={{ cursor: 'pointer' }} />
        ) : (
          <IconPlus size="0.8rem" style={{ cursor: 'pointer' }} />
        )
      }
      style={{ 
        cursor: loading ? 'not-allowed' : 'pointer',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 10
      }}
      onClick={() => {
        if (loading) return;
        isAssigned ? onRemoveRole(role.id) : onAddRole(role);
      }}
    >
      {role.name}
    </Badge>
  );

  const renderSection = (title, roles, isAssigned, IconComponent) => (
    <Paper shadow="sm" p="md" withBorder style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title order={4} mb="md">
        <Group spacing="xs">
          <IconComponent size="1.2rem" />
          {title}
        </Group>
      </Title>
      
      <ScrollArea.Autosize mah={300} type="always" offsetScrollbars>
        <Group gap="xs" wrap="wrap">
          {roles.length > 0 ? (
            roles.map(role => (
              <RoleItem key={role.id} role={role} isAssigned={isAssigned} />
            ))
          ) : (
            <Text size="sm" color="dimmed" fs="italic" w="100%" ta="center" mt="xl">
              {isAssigned 
                ? t('roles:transferList.noRolesAssigned') 
                : t('roles:transferList.noAvailableRoles')}
            </Text>
          )}
        </Group>
      </ScrollArea.Autosize>
      
      <Text size="xs" color="dimmed" mt="auto" pt="sm">
        {t('roles:transferList.total', { count: roles.length })}
      </Text>
    </Paper>
  );


  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
      {renderSection(t('roles:transferList.assigned'), assignedRoles, true, IconShieldCheck)}
      {renderSection(t('roles:transferList.available'), availableRoles, false, IconShieldPlus)}
    </SimpleGrid>
  );
});

RoleTransferList.displayName = 'RoleTransferList';

export default RoleTransferList;
