import { Container, Title, Group, Button, Breadcrumbs, Anchor } from '@mantine/core';
import { IconPlus, IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const ManagementLayout = ({
  title,
  children,
  icon: Icon,
  iconColor, 
  showBackButton = false,
  showCreateButton = false,
  createButtonLabel = "Create New",
  onCreateClick,
  createButtonDisabled = false,
  breadcrumbs = []
}) => {
  
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const items = [
    { title: t('common:navigation.main'), href: '/' },
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
      <Breadcrumbs mb="sm">{items}</Breadcrumbs>
      <Group justify="space-between" mt="lg" mb="xl">
          <Group gap="sm"> 
            {Icon && <Icon size="2.5rem" color={`var(--mantine-color-${iconColor}-6)`}/>}
            <Title order={1}>{title}</Title>
          </Group>

          {showBackButton && (
            <Button
              variant="outline"
              leftSection={<IconArrowLeft size="1rem" />}
              onClick={() => navigate(-1)}
            >
              {t('common:app.back')}
            </Button>
          )}
          
          {showCreateButton && (
            <Button
              leftSection={<IconPlus size="1rem" />}
              onClick={onCreateClick}
              disabled={createButtonDisabled}
            >
              {createButtonLabel}
            </Button>
          )}
        </Group>

      {children}
    </Container>
  );
};

export default ManagementLayout;
