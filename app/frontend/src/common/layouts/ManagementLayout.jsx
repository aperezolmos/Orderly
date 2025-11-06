import React from 'react';
import { Container, Title, Group, Button, Breadcrumbs, Anchor } from '@mantine/core';
import { IconPlus, IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';


const ManagementLayout = ({
  title,
  children,
  showBackButton = false,
  showCreateButton = false,
  createButtonLabel = "Create New",
  onCreateClick,
  breadcrumbs = []
}) => {
  
  const navigate = useNavigate();

  const items = [
    { title: 'Dashboard', href: '/' },
    ...breadcrumbs,
  ].map((item, index) => (
    <Anchor href={item.href} key={index} onClick={(e) => {
      e.preventDefault();
      navigate(item.href);
    }}>
      {item.title}
    </Anchor>
  ));
  

  return (
    <Container size="xl" py="xl">
      <Group position="apart" mb="xl">
        <div>
          <Breadcrumbs mb="sm">{items}</Breadcrumbs>
          <Title order={1}>{title}</Title>
        </div>
        
        <Group>
          {showBackButton && (
            <Button
              variant="outline"
              leftIcon={<IconArrowLeft size="1rem" />}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          )}
          
          {showCreateButton && (
            <Button
              leftIcon={<IconPlus size="1rem" />}
              onClick={onCreateClick}
            >
              {createButtonLabel}
            </Button>
          )}
        </Group>
      </Group>

      {children}
    </Container>
  );
};

export default ManagementLayout;
