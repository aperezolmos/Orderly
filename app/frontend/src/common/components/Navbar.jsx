import { useNavigate, NavLink } from 'react-router-dom';
import { Group, Button, Menu, Text, Burger, Divider, useMantineTheme,
         useMantineColorScheme, Avatar, Tooltip } from '@mantine/core';
import { IconChevronDown, IconHome, IconSettings, IconSun, IconMoon,
         IconUser, IconLogout, IconChevronRight } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { getNavigationConfig, filterModulesBySubItemsPermissions } from '../../utils/navigationConfig';


const Navbar = ({ opened, toggle }) => {
  
  const { isAuthenticated, user, permissions, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { t } = useTranslation('common');
  

  const modules = getNavigationConfig(t);
  const visibleModules = filterModulesBySubItemsPermissions(modules, permissions);

  const ordersModule = modules.find(m => m.id === 'orders');
  const canViewOrders = permissions.includes(ordersModule?.requiredPermission);


  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };


  return (
    <Group h="100%" px="md" justify="space-between">
      
      {/* LEFT SIDE: Logo and Navigation */}
      <Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

        <Text 
            size="xl" 
            fw={700} 
            style={{ cursor: 'pointer', fontFamily: 'Greycliff CF, sans-serif' }}
            onClick={() => navigate('/')}
        >
            Orderly
        </Text>

        {/* Desktop Navigation */}
        {!isMobile && isAuthenticated && (
            <Group ml="xl" gap="xs">
                <Button
                    component={NavLink}
                    to="/"
                    variant="subtle"
                    leftSection={<IconHome size={16} />}
                >
                    {t('common:navigation.main')}
                </Button>

                {ordersModule && canViewOrders && (
                    <Button
                        component={NavLink}
                        to={ordersModule.path}
                        variant="subtle"
                        color={ordersModule.color}
                        leftSection={<ordersModule.icon size={16} />}
                    >
                        {ordersModule.label}
                    </Button>
                )}

                {visibleModules.length > 0 && (
                    <Menu shadow="md" width={280} trigger="hover" openDelay={100} closeDelay={200} withinPortal>
                        <Menu.Target>
                            <Button variant="subtle" leftSection={<IconSettings size={16} />} rightSection={<IconChevronDown size={14} />}>
                                {t('common:navigation.management')}
                            </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>{t('common:navigation.management')}</Menu.Label>
                            <Divider mb="xs" />
                            
                            {visibleModules.map((module) => (
                                <Menu
                                    key={module.id}
                                    shadow="md"
                                    position="right-start"
                                    offset={0}
                                    trigger="hover"
                                    openDelay={100}
                                    closeDelay={200}
                                    withinPortal
                                >
                                    <Menu.Target>
                                        <Menu.Item 
                                            leftSection={<module.icon size={16} color={`var(--mantine-color-${module.color}-6)`} />}
                                            rightSection={<IconChevronRight size={14} />}
                                        >
                                            {module.label}
                                        </Menu.Item>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Label>{module.label}</Menu.Label>
                                        {module.subItems.map((item, idx) => (
                                            <Menu.Item
                                                key={idx}
                                                leftSection={<item.icon size={14} />}
                                                onClick={() => navigate(item.path)}
                                            >
                                                {item.label}
                                            </Menu.Item>
                                        ))}
                                    </Menu.Dropdown>
                                </Menu>
                            ))}
                        </Menu.Dropdown>
                    </Menu>
                )}
            </Group>
        )}
      </Group>

      {/* RIGHT SIDE: Theme, Language & Auth */}
      <Group visibleFrom="sm">
        <Tooltip label={t('common:navigation.changeTheme')} position="bottom">
          <Button variant="subtle" size="sm" px="xs" onClick={toggleColorScheme}>
            {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
          </Button>
        </Tooltip>
        
        <LanguageSwitcher />

        {isAuthenticated && (
            <Menu shadow="md" width={200} position="bottom-end">
                <Menu.Target>
                    <Button 
                      variant="subtle" 
                      leftSection={
                        <Avatar size="sm" radius="xl" color="blue">
                          <IconUser size={16}/>
                        </Avatar>
                      } 
                      rightSection={<IconChevronDown size={12}/>}
                    >
                      <Text maw={120} truncate>
                        {user?.username}
                      </Text>
                    </Button>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item leftSection={<IconUser size={14}/>} onClick={() => navigate('/profile')}>
                        {t('common:userMenu.viewProfile')}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item color="red" leftSection={<IconLogout size={14}/>} onClick={handleLogout}>
                        {t('common:userMenu.logout')}
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        )}

        {!isAuthenticated && (
             <Button variant="outline" onClick={() => navigate('/register')}>{t('common:navigation.register')}</Button>
        )}
        
        {!isAuthenticated && (
             <Button onClick={() => navigate('/login')}>{t('common:navigation.login')}</Button>
        )}
      </Group>
    </Group>
  );
};

export default Navbar;
