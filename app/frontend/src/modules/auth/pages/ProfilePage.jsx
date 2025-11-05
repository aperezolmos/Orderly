import React from 'react';
import { useAuth } from '../../../context/useAuth';
import {
  Container,
  Title,
  Text,
  Group,
  Badge,
  Button,
  Card,
  SimpleGrid,
} from '@mantine/core';
import { IconUser, IconLogout, IconShield } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';


const ProfilePage = () => {
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  if (!user) {
    return null;
  }
  

  return (
    <Container size="lg" py="xl">
      <Group position="apart" mb="xl">
        <Title order={1}>User Profile</Title>
        <Button
          variant="outline"
          color="red"
          leftIcon={<IconLogout size="1rem" />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Group>

      <SimpleGrid cols={1} breakpoints={[{ minWidth: 'md', cols: 2 }]}>
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group mb="md">
            <IconUser size="2rem" />
            <div>
              <Text weight={500}>Personal Information</Text>
              <Text size="sm" color="dimmed">
                Basic user details
              </Text>
            </div>
          </Group>

          <Group position="apart" mb="xs">
            <Text weight={500}>Username:</Text>
            <Text>{user.username}</Text>
          </Group>

          {user.firstName && (
            <Group position="apart" mb="xs">
              <Text weight={500}>First Name:</Text>
              <Text>{user.firstName}</Text>
            </Group>
          )}

          {user.lastName && (
            <Group position="apart" mb="xs">
              <Text weight={500}>Last Name:</Text>
              <Text>{user.lastName}</Text>
            </Group>
          )}

          {user.createdAt && (
            <Group position="apart">
              <Text weight={500}>Member since:</Text>
              <Text>{new Date(user.createdAt).toLocaleDateString()}</Text>
            </Group>
          )}
        </Card>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group mb="md">
            <IconShield size="2rem" />
            <div>
              <Text weight={500}>Roles & Permissions</Text>
              <Text size="sm" color="dimmed">
                User roles in the system
              </Text>
            </div>
          </Group>

          <Text weight={500} mb="sm">Assigned Roles:</Text>
          <Group spacing="xs">
            {user.roleNames && user.roleNames.length > 0 ? (
              user.roleNames.map((role, index) => (
                <Badge key={index} variant="filled" color="blue">
                  {role}
                </Badge>
              ))
            ) : (
              <Text color="dimmed" size="sm">
                No roles assigned
              </Text>
            )}
          </Group>

          <Text size="sm" color="dimmed" mt="md">
            Total roles: {user.roleCount || 0}
          </Text>
        </Card>
      </SimpleGrid>
    </Container>
  );
};

export default ProfilePage;
