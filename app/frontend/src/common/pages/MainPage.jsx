import { Container, Title, Text, Group, Card, SimpleGrid, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { getNavigationConfig, filterModulesByRole } from '../../utils/navigationConfig';


const MainPage = () => {
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation('common');

  const modules = getNavigationConfig(t);
  const visibleFeatures = filterModulesByRole(modules, user?.roleNames);


  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="md" align="center">
        {user 
          ? t('common:app.welcomeUser', { name: user.username }) 
          : t('common:app.welcome')
        }
      </Title>
      
      <Text c="dimmed" size="lg" mb="xl" ta="center">
        {t('common:app.welcomeMessage')}
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {visibleFeatures.map((feature) => {
          
          const Icon = feature.icon;

          return (
            <Card
              key={feature.id}
              shadow="md"
              padding="lg"
              radius="md"
              withBorder
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <Group mb="md">
                <div style={{ color: `var(--mantine-color-${feature.color}-6)` }}>
                   <Icon size={30} stroke={1.5} />
                </div>
                <Title order={3}>{feature.label}</Title>
              </Group>
              
              <Text size="sm" c="dimmed" mb="md" style={{ flex: 1 }}>
                {feature.description}
              </Text>
              
              <Button
                variant="light"
                color={feature.color}
                fullWidth
                mt="auto"
                onClick={() => navigate(feature.path)}
              >
                {t('common:navigation.access')}
              </Button>
            </Card>
          );
        })}
      </SimpleGrid>

      {visibleFeatures.length === 0 && (
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Text ta="center" c="dimmed">
            {t('common:data.noData')}
          </Text>
        </Card>
      )}
    </Container>
  );
};

export default MainPage;
