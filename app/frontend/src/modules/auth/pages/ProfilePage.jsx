import { useAuth } from '../../../context/AuthContext';
import { Container, Title, Text, Group, Badge,
         Button, Card, SimpleGrid } from '@mantine/core';
import { IconUser, IconLogout, IconShield } from '@tabler/icons-react';
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

  if (!user) {
    return null;
  }
  

  return (
    <Container size="lg" py="xl">
      <Group position="apart" mb="xl">
        <Title order={1}>{t('auth:profile.title')}</Title>
        <Button
          variant="outline"
          color="red"
          leftSection={<IconLogout size="1rem" />}
          onClick={handleLogout}
        >
          {t('common:navigation.logout')}
        </Button>
      </Group>

      <SimpleGrid cols={1} breakpoints={[{ minWidth: 'md', cols: 2 }]}>
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group mb="md">
            <IconUser size="2rem" />
            <div>
              <Text weight={500}>{t('auth:profile.personalInfo')}</Text>
              <Text size="sm" color="dimmed">
                {t('auth:profile.basicDetails')}
              </Text>
            </div>
          </Group>

          <Group position="apart" mb="xs">
            <Text weight={500}>{t('users:form.username')}</Text>
            <Text>{user.username}</Text>
          </Group>

          {user.firstName && (
            <Group position="apart" mb="xs">
              <Text weight={500}>{t('users:form.firstName')}</Text>
              <Text>{user.firstName}</Text>
            </Group>
          )}

          {user.lastName && (
            <Group position="apart" mb="xs">
              <Text weight={500}>{t('users:form.lastName')}</Text>
              <Text>{user.lastName}</Text>
            </Group>
          )}

          {user.createdAt && (
            <Group position="apart">
              <Text weight={500}>{t('auth:profile.memberSince')}</Text>
              <Text>{new Date(user.createdAt).toLocaleDateString()}</Text>
            </Group>
          )}
        </Card>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group mb="md">
            <IconShield size="2rem" />
            <div>
              <Text weight={500}>{t('auth:profile.rolesPermissions')}</Text>
              <Text size="sm" color="dimmed">
                {t('auth:profile.userRoles')}
              </Text>
            </div>
          </Group>

          <Text weight={500} mb="sm">{t('auth:profile.assignedRoles')}</Text>
          <Group spacing="xs">
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
