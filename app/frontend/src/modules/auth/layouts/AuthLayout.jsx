import { Container, Paper, Title, Text, Button } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const AuthLayout = ({ 
  children, 
  title, 
  subtitle,
  linkComponent 
}) => {

  const navigate = useNavigate();
  const { t } = useTranslation('common');

  
  return (
    <Container size={420} my={40}>
      <div style={{ textAlign: 'center' }}>
        <Title order={2} style={{ fontWeight: 900 }}>
          {title}
        </Title>
        <Text color="dimmed" size="sm" mt={5}>
          {subtitle} {linkComponent}
        </Text>
      </div>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {children}
      </Paper>

      <div style={{ textAlign: 'center' }}>
        <Button
          size="xs"
          leftSection={<IconHome size={15} />}
          onClick={() => navigate('/')}
          variant="transparent"
          color="blue"
          mt="xl"
        >
          {t('common:error.accessDenied.backToHome')}
        </Button>
      </div>
    </Container>
  );
};

export default AuthLayout;
