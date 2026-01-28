import { useAuth } from '../../../context/AuthContext';
import { Container, Title, Text, Group, Badge,
         Button, Card, SimpleGrid } from '@mantine/core';
import { IconEdit, IconUser, IconLogout, IconShield } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const ProfilePage = () => {
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'auth', 'users']);


  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  if (!user) return null;
  

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>{t('auth:profile.title')}</Title>
        <Group>
          <Button
            variant="light"
            leftSection={<IconEdit size="1rem" />}
            onClick={() => navigate('/profile/edit')}
          >
            {t('auth:profile.editTitle')}
          </Button>
          <Button
            variant="outline"
            color="red"
            leftSection={<IconLogout size="1rem" />}
            onClick={handleLogout}
          >
            {t('common:navigation.logout')}
          </Button>
        </Group>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group mb="md">
            <IconUser size="2rem" />
            <div>
              <Text fw={500}>{t('auth:profile.personalInfo')}</Text>
              <Text size="sm" c="dimmed">
                {t('auth:profile.basicDetails')}
              </Text>
            </div>
          </Group>

          <Group justify="space-between" mb="xs">
            <Text fw={500}>{t('users:form.username')}</Text>
            <Text>{user.username}</Text>
          </Group>

          {user.firstName && (
            <Group justify="space-between" mb="xs">
              <Text fw={500}>{t('users:form.firstName')}</Text>
              <Text>{user.firstName}</Text>
            </Group>
          )}

          {user.lastName && (
            <Group justify="space-between" mb="xs">
              <Text fw={500}>{t('users:form.lastName')}</Text>
              <Text>{user.lastName}</Text>
            </Group>
          )}

          {user.createdAt && (
            <Group justify="space-between" mb="xs">
              <Text fw={500}>{t('auth:profile.memberSince')}</Text>
              <Text size="sm" color="dimmed">
                {new Date(user.createdAt).toLocaleString()}
              </Text>
            </Group>
          )}

          {user.updatedAt && (
            <Group justify="space-between">
              <Text fw={500}>{t('auth:profile.lastUpdated')}</Text>
              <Text size="sm" color="dimmed">
                {new Date(user.updatedAt).toLocaleString()}
              </Text>
            </Group>
          )}
        </Card>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group mb="md">
            <IconShield size="2rem" />
            <div>
              <Text fw={500}>{t('auth:profile.rolesPermissions')}</Text>
              <Text size="sm" color="dimmed">
                {t('auth:profile.userRoles')}
              </Text>
            </div>
          </Group>

          <Text fw={500} mb="sm">{t('auth:profile.assignedRoles')}</Text>
          <Group gap="xs">
            {user.roleNames && user.roleNames.length > 0 ? (
              user.roleNames.map((role, index) => (
                <Badge key={index} variant="filled" color="blue">
                  {role}
                </Badge>
              ))
            ) : (
              <Text color="dimmed" size="sm">
                {t('auth:profile.noRoles')}
              </Text>
            )}
          </Group>

          <Text size="sm" color="dimmed" mt="md">
            {t('auth:profile.totalRoles', { count: user.roleCount || 0 })}
          </Text>
        </Card>
      </SimpleGrid>
    </Container>
  );
};

export default ProfilePage;
