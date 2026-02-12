import { Container, Title, Text, Button, Stack, Center } from '@mantine/core';
import { IconShieldLock, IconHome } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';


const AccessDeniedView = ({ showHomeButton = true }) => {
  
  const { t } = useTranslation('common');
  const navigate = useNavigate();


  return (
    <Center style={{ height: '70vh' }}>
      <Container size="sm" p="xl">
        <Stack align="center" gap="xl">
          <IconShieldLock 
            size={80} 
            style={{ 
              color: 'var(--mantine-color-red-7)',
              opacity: 0.7
            }} 
          />
          
          <div style={{ textAlign: 'center' }}>
            <Title order={1} size="h2" fw={900} c="red.6">
              403
            </Title>
            <Title order={2} size="h3" fw={700} mt="md">
              {t('common:error.accessDenied.title')}
            </Title>
            <Text size="lg" c="dimmed" mt="sm">
              {t('common:error.accessDenied.description')}
            </Text>
          </div>

          {showHomeButton && (
            <Button
              size="sm"
              leftSection={<IconHome size={16} />}
              onClick={() => navigate('/')}
              variant="light"
              color="blue"
              mt="xl"
            >
              {t('common:error.accessDenied.backToHome')}
            </Button>
          )}
        </Stack>
      </Container>
    </Center>
  );
};

export default AccessDeniedView;
