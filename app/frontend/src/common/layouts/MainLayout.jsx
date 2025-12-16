import React, { useState } from 'react';
import { AppShell, Container, NavLink, Box, Stack,
        ScrollArea, Text, useMantineTheme } from '@mantine/core';
import { IconHome, IconPackage, IconUsers, IconShield, IconDesk,
         IconCalendar, IconChartBar, IconPlus, IconList } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import { useMediaQuery } from '@mantine/hooks';


const MainLayout = ({ children }) => {
  
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const { t } = useTranslation('common');
  

  // Management modules for sidebar
  const managementModules = [
    {
      name: t('navigation.main'),
      path: '/',
      icon: <IconHome size={20} />,
      adminOnly: false
    },
    {
      name: t('navigation.foods'),
      icon: <IconPackage size={20} />,
      color: 'green',
      items: [
        { label: t('common:app.create'), path: '/foods/new', icon: <IconPlus size={16} /> },
        { label: t('common:navigation.list'), path: '/foods', icon: <IconList size={16} /> }
      ],
      adminOnly: true
    },
    {
      name: t('navigation.products'),
      icon: <IconPackage size={20} />,
      color: 'orange',
      items: [
        { label: t('common:app.create'), path: '/products/new', icon: <IconPlus size={16} /> },
        { label: t('common:navigation.list'), path: '/products', icon: <IconList size={16} /> }
      ],
      adminOnly: true
    },
    {
      name: t('navigation.users'),
      icon: <IconUsers size={20} />,
      color: 'blue',
      items: [
        { label: t('common:app.create'), path: '/users/new', icon: <IconPlus size={16} /> },
        { label: t('common:navigation.list'), path: '/users', icon: <IconList size={16} /> }
      ],
      adminOnly: true
    },
    {
      name: t('navigation.roles'),
      icon: <IconShield size={20} />,
      color: 'violet',
      items: [
        { label: t('common:app.create'), path: '/roles/new', icon: <IconPlus size={16} /> },
        { label: t('common:navigation.list'), path: '/roles', icon: <IconList size={16} /> }
      ],
      adminOnly: true
    },
    {
      name: t('navigation.tables'),
      icon: <IconDesk size={20} />,
      color: 'cyan',
      items: [
        { label: t('common:app.create'), path: '/tables/new', icon: <IconPlus size={16} /> },
        { label: t('common:navigation.list'), path: '/tables', icon: <IconList size={16} /> }
      ],
      adminOnly: true
    },
    {
      name: t('navigation.reservations'),
      icon: <IconCalendar size={20} />,
      color: 'pink',
      items: [
        { label: t('common:app.create'), path: '/reservations/new', icon: <IconPlus size={16} /> },
        { label: t('common:navigation.list'), path: '/reservations', icon: <IconList size={16} /> }
      ],
      adminOnly: true
    },
    {
      name: t('navigation.orders'),
      icon: <IconChartBar size={20} />,
      color: 'grape',
      items: [
        { label: t('common:navigation.list'), path: '/orders', icon: <IconList size={16} /> }
      ],
      adminOnly: false
    }
  ];

  const isAdmin = user?.roleNames?.includes('ROLE_ADMIN');
  const filteredModules = managementModules.filter(module => 
    !module.adminOnly || (module.adminOnly && isAdmin)
  );


  return (
    <AppShell
      header={{ height: 64 }}
      navbar={isAuthenticated && isMobile ? {
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      } : undefined}
      padding="md"
      styles={{
        header: {
          paddingTop: '4px',
        },
        navbar: {
          [`@media (maxWidth: ${theme.breakpoints.sm})`]: {
            height: 'calc(100vh - 64px)', // Max height
            overflowY: 'auto', // Scroll
          },
        },
      }}
    >
      {/* Header with Navbar */}
      <AppShell.Header>
        <Container size="xl" h="100%" px="md" pt="xs">
          <Navbar opened={opened} toggle={() => setOpened((o) => !o)} />
        </Container>
      </AppShell.Header>

      {/* Sidebar Navigation (only for mobile and authenticated users) */}
      {isAuthenticated && isMobile && (
        <AppShell.Navbar p={0}>
          <ScrollArea h={`calc(100vh - 64px)`} type="scroll">
            <Box p="md">
              <Stack gap={4}>
                {filteredModules.map((module) => (
                  <React.Fragment key={module.name}>
                    {module.path ? (
                      // Simple link for main page
                      <NavLink
                        label={module.name}
                        leftSection={module.icon}
                        active={location.pathname === module.path}
                        onClick={() => {
                          navigate(module.path);
                          setOpened(false);
                        }}
                        variant="filled"
                        style={{
                          borderRadius: theme.radius.sm,
                          '&[dataActive]': {
                            backgroundColor: theme.colors.blue[0],
                            color: theme.colors.blue[7],
                          },
                        }}
                      />
                    ) : (
                      // Collapsible section for modules with sub-items
                      <Box>
                        <Box
                          style={{
                            padding: '8px 12px',
                            borderRadius: theme.radius.sm,
                            color: theme.colors.gray[7],
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '4px',
                          }}
                        >
                          <Box style={{ color: `var(--mantine-color-${module.color}-6)` }}>
                            {module.icon}
                          </Box>
                          <Text size="sm">{module.name}</Text>
                        </Box>
                        <Stack gap={2} ml="xl" mb="md">
                          {module.items.map((item, idx) => (
                            <NavLink
                              key={idx}
                              label={item.label}
                              leftSection={item.icon}
                              active={location.pathname === item.path}
                              onClick={() => {
                                navigate(item.path);
                                setOpened(false);
                              }}
                              variant="light"
                              style={{
                                borderRadius: theme.radius.sm,
                                '&[dataActive]': {
                                  backgroundColor: theme.colors.blue[0],
                                  color: theme.colors.blue[7],
                                },
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </React.Fragment>
                ))}
              </Stack>
            </Box>
          </ScrollArea>
        </AppShell.Navbar>
      )}

      {/* Main content area */}
      <AppShell.Main>
        <Container size="xl">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default MainLayout;
