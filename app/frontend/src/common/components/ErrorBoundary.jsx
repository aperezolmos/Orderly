import React from 'react';
import { Alert, Button, Stack, Text } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';


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
      return (
        <Alert 
          icon={<IconAlertTriangle size="1.5rem" />}
          title="Something went wrong"
          color="red"
          variant="filled"
        >
          <Stack>
            <Text>An error occurred while rendering this component.</Text>
            <Button 
              variant="white" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </Stack>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
