import { Container, Title, Text, Group, Card, SimpleGrid, 
         Button, Stack, ThemeIcon, Alert} from '@mantine/core';
import { IconLockAccess, IconClock, IconShieldCheck , IconUserShield } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { getNavigationConfig, filterModulesByPermission } from '../../../utils/navigationConfig';


const HomeDashboardView = () => {
  
  const navigate = useNavigate();
  const { user, permissions } = useAuth();
  const { t } = useTranslation('common');

  const modules = getNavigationConfig(t);
  const visibleFeatures = filterModulesByPermission(modules, permissions);


  if (visibleFeatures.length === 0) {
    return (
      <Container size="xl" py="xl">
        {user && (
          <Title order={1} mb="md" align="center">
            {t('common:app.welcomeUser', { name: user.username })}
          </Title>
        )}
        
        <Stack align="center" mt="120" spacing="xl">
          <Group position="center" spacing="xs">
            <ThemeIcon size={60} radius="lg" variant="light" color="blue">
              <IconLockAccess size={28} />
            </ThemeIcon>
            <ThemeIcon size={60} radius="lg" variant="light" color="violet">
              <IconClock size={28} />
            </ThemeIcon>
            <ThemeIcon size={60} radius="lg" variant="light" color="pink">
              <IconShieldCheck size={28} />
            </ThemeIcon>
          </Group>

          <Stack align="center" spacing="lg" maw={600}>
            <Title order={2} fw={800} size="h1" ta="center" mt={20}>
              {t('common:error.noModulesToShow.title')}
            </Title>
            <Text size="lg" c="dimmed" ta="center" style={{ lineHeight: 1.6 }} maw={500} mt={10}>
              {t('common:error.noModulesToShow.message')}
            </Text>

            <Alert 
              variant="light" 
              color="blue" 
              radius="md"
              icon={<IconUserShield size={24} />}
              mt="80"
              styles={{
                root: { width: '100%', maxWidth: 500 },
                message: { fontWeight: 500 }
              }}
            >
              {t('common:error.noModulesToShow.adminHint')}
            </Alert>

          </Stack>
        </Stack>
      </Container>
    );
  }


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
    </Container>
  );
};

export default HomeDashboardView;
