import React from 'react';
import { Alert, Button, Stack, Text, Center, Container } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';


class ErrorBoundary extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}


const ErrorFallback = () => {
  
  const { t } = useTranslation('common');

  return (
    <Center style={{ height: '100vh', width: '100%' }}>
      <Container size="sm">
        <Alert 
          icon={<IconAlertTriangle size="1.5rem" />}
          title={t('common:error.boundary.title')}
          color="red"
          variant="filled"
          radius="md"
          shadow="md"
        >
          <Stack align="flex-start" gap="md">
            <Text size="sm">
              {t('common:error.boundary.message')}
            </Text>
            <Button 
              variant="white" 
              color="red"
              onClick={() => globalThis.location.reload()}
              fullWidth
            >
              {t('common:error.boundary.reload')}
            </Button>
          </Stack>
        </Alert>
      </Container>
    </Center>
  );
};

export default ErrorBoundary;
