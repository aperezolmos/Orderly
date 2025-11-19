import React from 'react';
import { Alert, Button, Stack, Text } from '@mantine/core';
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
    <Alert 
      icon={<IconAlertTriangle size="1.5rem" />}
      title={t('error.boundary.title')}
      color="red"
      variant="filled"
    >
      <Stack>
        <Text>{t('error.boundary.message')}</Text>
        <Button 
          variant="white" 
          onClick={() => window.location.reload()}
        >
          {t('error.boundary.reload')}
        </Button>
      </Stack>
    </Alert>
  );
};

export default ErrorBoundary;
