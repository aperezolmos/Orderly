import React, { memo } from 'react';
import { Group, Badge, Paper, Title, Text, ScrollArea, Stack } from '@mantine/core';
import { IconX, IconPlus, IconShield } from '@tabler/icons-react';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


const RoleTransferList = memo(({
  assignedRoles = [],
  availableRoles = [],
  onAddRole,
  onRemoveRole,
  loading = false
}) => {
  
  const { t } = useTranslationWithLoading(['common', 'roles']);


  return (
    <Group grow align="flex-start" spacing="xl">
      
      {/* Assigned roles */}
      <Paper shadow="sm" p="md" withBorder style={{ flex: 1 }}>
        <Title order={4} mb="md">
          <Group spacing="xs">
            <IconShield size="1.2rem" />
            {t('roles:transferList.assigned')}
          </Group>
        </Title>
        
        <Text size="sm" color="dimmed" mb="md">
          {t('roles:transferList.currentRoles')}
        </Text>

        <ScrollArea.Autosize mah={300}>
          <Stack spacing="xs">
            {assignedRoles.length > 0 ? (
              assignedRoles.map((role) => (
                <Badge
                  key={`assigned-${role.id}`}
                  size="lg"
                  variant="filled"
                  color="blue"
                  rightSection={
                    <IconX 
                      size="0.8rem" 
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        !loading && onRemoveRole(role.id);
                      }}
                    />
                  }
                  style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                  onClick={() => !loading && onRemoveRole(role.id)}
                >
                  {role.name}
                </Badge>
              ))
            ) : (
              <Text size="sm" color="dimmed" fs="italic">
                {t('roles:transferList.noRolesAssigned')}
              </Text>
            )}
          </Stack>
        </ScrollArea.Autosize>
        
        <Text size="xs" color="dimmed" mt="sm">
          {t('roles:transferList.total', { count: assignedRoles.length })}
        </Text>
      </Paper>


      {/* Available roles */}
      <Paper shadow="sm" p="md" withBorder style={{ flex: 1 }}>
        <Title order={4} mb="md">
          <Group spacing="xs">
            <IconShield size="1.2rem" />
            {t('roles:transferList.available')}
          </Group>
        </Title>
        
        <Text size="sm" color="dimmed" mb="md">
          {t('roles:transferList.clickToAssign')}
        </Text>

        <ScrollArea.Autosize mah={300}>
          <Stack spacing="xs">
            {availableRoles.length > 0 ? (
              availableRoles.map((role) => (
                <Badge
                  key={`available-${role.id}`}
                  size="lg"
                  variant="outline"
                  color="gray"
                  rightSection={
                    <IconPlus 
                      size="0.8rem" 
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        !loading && onAddRole(role);
                      }}
                    />
                  }
                  style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                  onClick={() => !loading && onAddRole(role)}
                >
                  {role.name}
                </Badge>
              ))
            ) : (
              <Text size="sm" color="dimmed" fs="italic">
                {t('roles:transferList.noAvailableRoles')}
              </Text>
            )}
          </Stack>
        </ScrollArea.Autosize>
        
        <Text size="xs" color="dimmed" mt="sm">
          {t('roles:transferList.availableCount', { count: availableRoles.length })}
        </Text>
      </Paper>
    </Group>
  );
});

RoleTransferList.displayName = 'RoleTransferList';

export default RoleTransferList;
