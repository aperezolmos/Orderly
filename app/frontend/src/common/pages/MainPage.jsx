import { Container, Title, Text, Group, Card, SimpleGrid, Button } from '@mantine/core';
import { IconUsers, IconShield, IconPackage, IconChartBar,
         IconCalendar, IconDesk } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useTranslation } from 'react-i18next';


const MainPage = () => {
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation('common');


  const features = [
    {
      title: t('navigation.users'),
      description: 'Manage system users and permissions', // TODO: añadir traducción
      icon: <IconUsers size={30} />,
      path: '/users',
      color: 'blue',
      adminOnly: true
    },
    {
      title: t('navigation.roles'),
      description: 'Configure user roles and permissions',
      icon: <IconShield size={30} />,
      path: '/roles',
      color: 'violet',
      adminOnly: true
    },
    {
      title: t('navigation.foods'),
      description: 'Manage food items and categories',
      icon: <IconPackage size={30} />,
      path: '/foods',
      color: 'green',
      adminOnly: true
    },
    {
      title: t('navigation.products'),
      description: 'Handle product inventory',
      icon: <IconPackage size={30} />,
      path: '/products',
      color: 'orange',
      adminOnly: true
    },
    {
      title: t('navigation.tables'),
      description: 'Manage dining tables and availability',
      icon: <IconDesk size={30} />,
      path: '/tables',
      color: 'cyan',
      adminOnly: true
    },
    {
      title: t('navigation.reservations'),
      description: 'Handle table reservations',
      icon: <IconCalendar size={30} />,
      path: '/reservations',
      color: 'pink',
      adminOnly: true
    },
    {
      title: t('navigation.orders'),
      description: 'View and manage customer orders',
      icon: <IconChartBar size={30} />,
      path: '/orders',
      color: 'grape',
      adminOnly: false
    }
  ];

  const isAdmin = user?.roleNames?.includes('ROLE_ADMIN'); //TODO: variable

  const filteredFeatures = features.filter(feature => 
    !feature.adminOnly || (feature.adminOnly && isAdmin)
  );


  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="md" align="center">
        {t('app.welcome')}, {user?.username || t('navigation.user')}!
      </Title>
      
      <Text color="dimmed" size="lg" mb="xl" align="center">
        {t('app.welcomeMessage')}
      </Text>

      <SimpleGrid 
        cols={3} 
        breakpoints={[
          { maxWidth: 'lg', cols: 2 },
          { maxWidth: 'sm', cols: 1 }
        ]}
        spacing="lg"
      >
        {filteredFeatures.map((feature, index) => (
          <Card
            key={index}
            shadow="md"
            padding="lg"
            radius="md"
            withBorder
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <Group mb="md">
              <div style={{ color: `var(--mantine-color-${feature.color}-6)` }}>
                {feature.icon}
              </div>
              <Title order={3}>{feature.title}</Title>
            </Group>
            
            <Text size="sm" color="dimmed" mb="md" style={{ flex: 1 }}>
              {feature.description}
            </Text>
            
            <Button
              variant="light"
              color={feature.color}
              fullWidth
              mt="auto"
              onClick={() => navigate(feature.path)}
            >
              {t('navigation.access')}
            </Button>
          </Card>
        ))}
      </SimpleGrid>

      {filteredFeatures.length === 0 && (
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Text align="center" color="dimmed">
            {t('data.noData')}
          </Text>
        </Card>
      )}
    </Container>
  );
};

export default MainPage;
