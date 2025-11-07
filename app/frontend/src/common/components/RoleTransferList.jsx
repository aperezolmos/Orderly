import React from 'react';
import { Group, Badge, Paper, Title,
         Text, ScrollArea, Stack, Divider } from '@mantine/core';
import { IconX, IconPlus, IconShield } from '@tabler/icons-react';


const RoleTransferList = ({
  assignedRoles = [],
  availableRoles = [],
  onAddRole,
  onRemoveRole,
  loading = false
}) => {
  
  return (
    <Group grow align="flex-start" spacing="xl">
      
      {/* Assigned roles */}
      <Paper shadow="sm" p="md" withBorder style={{ flex: 1 }}>
        <Title order={4} mb="md">
          <Group spacing="xs">
            <IconShield size="1.2rem" />
            Assigned Roles
          </Group>
        </Title>
        
        <Text size="sm" color="dimmed" mb="md">
          Current user roles (click to remove)
        </Text>

        <ScrollArea.Autosize mah={300}>
          <Stack spacing="xs">
            {assignedRoles.length > 0 ? (
              assignedRoles.map((role) => (
                <Badge
                  key={role.id}
                  size="lg"
                  variant="filled"
                  color="blue"
                  rightSection={
                    <IconX 
                      size="0.8rem" 
                      style={{ cursor: 'pointer' }}
                      onClick={() => !loading && onRemoveRole(role.id)}
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
                No roles assigned
              </Text>
            )}
          </Stack>
        </ScrollArea.Autosize>
        
        <Text size="xs" color="dimmed" mt="sm">
          Total: {assignedRoles.length} roles
        </Text>
      </Paper>
      

      {/* Available roles */}
      <Paper shadow="sm" p="md" withBorder style={{ flex: 1 }}>
        <Title order={4} mb="md">
          <Group spacing="xs">
            <IconShield size="1.2rem" />
            Available Roles
          </Group>
        </Title>
        
        <Text size="sm" color="dimmed" mb="md">
          Click to assign to user
        </Text>

        <ScrollArea.Autosize mah={300}>
          <Stack spacing="xs">
            {availableRoles.length > 0 ? (
              availableRoles.map((role) => (
                <Badge
                  key={role.id}
                  size="lg"
                  variant="outline"
                  color="gray"
                  rightSection={
                    <IconPlus 
                      size="0.8rem" 
                      style={{ cursor: 'pointer' }}
                      onClick={() => !loading && onAddRole(role)}
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
                No available roles
              </Text>
            )}
          </Stack>
        </ScrollArea.Autosize>
        
        <Text size="xs" color="dimmed" mt="sm">
          Available: {availableRoles.length} roles
        </Text>
      </Paper>
    </Group>
  );
};

export default RoleTransferList;
