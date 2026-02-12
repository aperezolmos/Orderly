import { Card, LoadingOverlay, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import ManagementLayout from './ManagementLayout';


const FormLayout = ({
  title,
  children,
  icon,
  iconColor,
  loading = false,
  error = null,
  onClearError,
  ...managementProps
}) => {
  
  return (
    <ManagementLayout 
      title={title} 
      icon={icon} 
      iconColor={iconColor} 
      {...managementProps}
    >
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} blur={2} />
        
        {error && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Error"
            color="red"
            mb="md"
            withCloseButton
            onClose={onClearError}
          >
            {error}
          </Alert>
        )}

        <Card shadow="sm" p="lg" radius="md" withBorder>
          {children}
        </Card>
      </div>
    </ManagementLayout>
  );
};

export default FormLayout;
