import React from 'react';
import { Container, Paper, Title, Text } from '@mantine/core';

const AuthLayout = ({ 
  children, 
  title, 
  subtitle,
  linkComponent 
}) => {
  
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
    </Container>
  );
};

export default AuthLayout;
