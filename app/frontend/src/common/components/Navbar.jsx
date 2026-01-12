import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Group, Button, Menu, Avatar, Text, Box, Burger, Stack,
         Divider, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { IconUser, IconLogout, IconChevronDown, IconHome, IconPackage,
         IconUsers, IconShield, IconDesk, IconCalendar, IconChartBar, IconPlus,
         IconList, IconLayoutDashboard, IconSettings, IconSun, IconMoon,
         IconChevronRight } from '@tabler/icons-react';
import { useAuth } from '../../context/useAuth';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@mantine/hooks';


const Navbar = ({ opened, toggle }) => {
  
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [hoveredModule, setHoveredModule] = useState(null);
  const { t } = useTranslation('common');


  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // Management modules with their sub-options
  const managementModules = [
    {
      name: t('common:navigation.foods.name'),
      icon: <IconPackage size={18} />,
      color: 'green',
      items: [
        { label: t('common:app.create'), path: '/foods/new', icon: <IconPlus size={14} /> },
        { label: t('common:navigation.list'), path: '/foods', icon: <IconList size={14} /> }
      ],
      adminOnly: true
    },
    {
      name: t('common:navigation.products.name'),
      icon: <IconPackage size={18} />,
      color: 'orange',
      items: [
        { label: t('common:app.create'), path: '/products/new', icon: <IconPlus size={14} /> },
        { label: t('common:navigation.list'), path: '/products', icon: <IconList size={14} /> }
      ],
      adminOnly: true
    },
    {
      name: t('common:navigation.users.name'),
      icon: <IconUsers size={18} />,
      color: 'blue',
      items: [
        { label: t('common:app.create'), path: '/users/new', icon: <IconPlus size={14} /> },
        { label: t('common:navigation.list'), path: '/users', icon: <IconList size={14} /> }
      ],
      adminOnly: true
    },
    {
      name: t('common:navigation.roles.name'),
      icon: <IconShield size={18} />,
      color: 'violet',
      items: [
        { label: t('common:app.create'), path: '/roles/new', icon: <IconPlus size={14} /> },
        { label: t('common:navigation.list'), path: '/roles', icon: <IconList size={14} /> }
      ],
      adminOnly: true
    },
    {
      name: t('common:navigation.tables.name'),
      icon: <IconDesk size={18} />,
      color: 'cyan',
      items: [
        { label: t('common:app.create'), path: '/tables/new', icon: <IconPlus size={14} /> },
        { label: t('common:navigation.list'), path: '/tables', icon: <IconList size={14} /> }
      ],
      adminOnly: true
    },
    {
      name: t('common:navigation.reservations.name'),
      icon: <IconCalendar size={18} />,
      color: 'pink',
      items: [
        { label: t('common:app.create'), path: '/reservations/new', icon: <IconPlus size={14} /> },
        { label: t('common:navigation.list'), path: '/reservations', icon: <IconList size={14} /> }
      ],
      adminOnly: true
    },
    {
      name: t('common:navigation.orders.name'),
      icon: <IconChartBar size={18} />,
      color: 'grape',
      items: [
        { label: t('common:navigation.dashboard'), path: '/orders', icon: <IconLayoutDashboard size={14} /> },
        { label: t('common:navigation.list'), path: '/orders/history', icon: <IconList size={14} /> }
      ],
      adminOnly: false
    }
  ];

  const isAdmin = user?.roleNames?.includes('ROLE_ADMIN');
  const filteredModules = managementModules.filter(module => 
    !module.adminOnly || (module.adminOnly && isAdmin)
  );


  return (
    <Group justify="space-between" style={{ flex: 1, paddingTop: '4px' }}>
      
      {/* Left side - Logo and Navigation */}
      <Group>
        {/* Burger menu for mobile */}
        {isMobile && (
          <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
            color={theme.colors.gray[6]}
          />
        )}

        {/* App Name with padding */}
        <Box style={{ paddingTop: '2px' }}>
          <Text 
            size="xl" 
            weight={700} 
            style={{ 
              cursor: 'pointer',
              fontFamily: 'Greycliff CF, sans-serif',
              lineHeight: 1.2
            }}
            onClick={() => navigate('/')}
          >
            NombreApp
          </Text>
        </Box>

        {/* Home Button (Desktop only) */}
        {!isMobile && isAuthenticated && (
          <Button
            component={NavLink}
            to="/"
            variant="subtle"
            size="sm"
            leftSection={<IconHome size={16} />}
            styles={{
              root: {
                '&[dataActive]': {
                  backgroundColor: theme.colors.blue[0],
                  color: theme.colors.blue[7],
                },
              },
            }}
          >
            {t('common:navigation.main')}
          </Button>
        )}

        {/* Management Menu (Desktop only) */}
        {!isMobile && isAuthenticated && filteredModules.length > 0 && (
          <Menu 
            shadow="md" 
            width={280}
            position="bottom-start"
            trigger="hover"
            openDelay={100}
            closeDelay={200}
            withinPortal
          >
            <Menu.Target>
              <Button
                variant="subtle"
                size="sm"
                leftSection={<IconSettings size={16} />}
                rightSection={<IconChevronDown size={14} />}
              >
                {t('common:navigation.management')}
              </Button>
            </Menu.Target>

            <Menu.Dropdown style={{ padding: '8px' }}>
              <Menu.Label>{t('common:navigation.management')}</Menu.Label>
              <Divider mb="xs" />
              
              <Stack gap={2}>
                {filteredModules.map((module) => (
                  <Menu 
                    key={module.name}
                    shadow="md" 
                    position="right-start"
                    offset={5}
                    trigger="hover"
                    openDelay={100}
                    closeDelay={200}
                    withinPortal
                    onOpen={() => setHoveredModule(module.name)}
                    onClose={() => setHoveredModule(null)}
                  >
                    <Menu.Target>
                      <Box
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: theme.radius.sm,
                          cursor: 'pointer',
                          backgroundColor: hoveredModule === module.name 
                            ? theme.colors.gray[0] 
                            : 'transparent',
                          '&:hover': {
                            backgroundColor: theme.colors.gray[0],
                          },
                          transition: 'background-color 150ms ease',
                        }}
                      >
                        <Group gap="xs">
                          <Box style={{ color: `var(--mantine-color-${module.color}-6)` }}>
                            {module.icon}
                          </Box>
                          <Text size="sm">{module.name}</Text>
                        </Group>
                        <IconChevronRight size={14} />
                      </Box>
                    </Menu.Target>
                    
                    <Menu.Dropdown 
                      style={{ 
                        minWidth: 180,
                        marginLeft: 4
                      }}
                    >
                      <Menu.Label 
                        style={{ 
                          padding: '8px 12px',
                          fontSize: theme.fontSizes.sm,
                          fontWeight: 600
                        }}
                      >
                        {module.name}
                      </Menu.Label>
                      {module.items.map((item, idx) => (
                        <Menu.Item
                          key={idx}
                          leftSection={item.icon}
                          onClick={() => navigate(item.path)}
                          style={{
                            padding: '8px 12px',
                            fontSize: theme.fontSizes.sm,
                            '&:hover': {
                              backgroundColor: theme.colors.blue[0],
                            },
                          }}
                        >
                          {item.label}
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                ))}
              </Stack>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>

      {/* Right side - Theme, Language & Auth */}
      <Group>
        {/* Theme Toggle */}
        <Button
          variant="subtle"
          size="sm"
          onClick={() => toggleColorScheme()}
          aria-label="Toggle color scheme"
        >
          {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
        </Button>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Authentication Section */}
        {!isAuthenticated ? (
          <Group gap="xs">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/register')}
            >
              {t('common:navigation.register')}
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/login')}
            >
              {t('common:navigation.login')}
            </Button>
          </Group>
        ) : (
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Button
                variant="subtle"
                rightSection={<IconChevronDown size={14} />}
                leftSection={
                  <Avatar
                    size="sm"
                    radius="xl"
                    color="blue"
                  >
                    <IconUser size={16} />
                  </Avatar>
                }
              >
                <Box style={{ maxWidth: 120, overflow: 'hidden' }}>
                  <Text truncate size="sm">
                    {user?.username}
                  </Text>
                </Box>
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconUser size={14} />}
                onClick={() => navigate('/profile')}
              >
                {t('common:userMenu.viewProfile')}
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={14} />}
                onClick={handleLogout}
              >
                {t('common:userMenu.logout')}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
    </Group>
  );
};

export default Navbar;
