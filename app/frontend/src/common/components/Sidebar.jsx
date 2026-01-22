import { ScrollArea, Stack, NavLink, Avatar, Text, Group, 
         Menu, UnstyledButton, rem, Divider, useMantineColorScheme,
         AppShell, ThemeIcon } from '@mantine/core';
import { IconLogout, IconChevronRight, IconSun, IconMoon, 
         IconSettings, IconLanguage, IconUser } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { getNavigationConfig, filterModulesByRole } from '../../utils/navigationConfig';


const Sidebar = ({ closeMobile }) => {
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation('common');
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const modules = getNavigationConfig(t);
  const visibleModules = filterModulesByRole(modules, user?.roleNames);

  const handleLogout = async () => {
    if (closeMobile) closeMobile();
    await logout();
    navigate('/login', { replace: true });
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const items = visibleModules.map((item) => {
    const hasActiveChild = item.subItems?.some(sub => sub.path === location.pathname);
    const Icon = item.icon;

    return (
      <NavLink
        key={item.id}
        label={item.label}
        leftSection={<Icon size="1.2rem" stroke={1.5} />}
        childrenOffset={28}
        defaultOpened={hasActiveChild}
        active={item.path === location.pathname || hasActiveChild}
        variant="light"
        color={item.color}
      >
        {item.subItems?.map((sub) => {
          const SubIcon = sub.icon;
          return (
            <NavLink
              key={sub.path}
              label={sub.label}
              leftSection={<SubIcon size="1rem" stroke={1.5} />}
              onClick={() => {
                navigate(sub.path);
                if (closeMobile) closeMobile();
              }}
              active={location.pathname === sub.path}
            />
          );
        })}
      </NavLink>
    );
  });


  return (
    <>
      {/* SCROLLABLE SECTION: Main Menu */}
      <AppShell.Section grow component={ScrollArea} p="md">
        <Stack gap="xs">
            <NavLink 
                label={t('common:navigation.main')} 
                leftSection={<ThemeIcon variant="light" size="sm" color="gray"><IconSettings size="0.8rem"/></ThemeIcon>}
                onClick={() => { navigate('/'); if(closeMobile) closeMobile(); }}
                active={location.pathname === '/'}
            />
            
            <Divider my="xs" label={t('common:navigation.management')} labelPosition="left" />
            
            {items}
        </Stack>
      </AppShell.Section>

      {/* FIXED SECTION: Footer with User */}
      <AppShell.Section p="md" style={{ borderTop: `1px solid var(--mantine-color-default-border)` }}>
        <Menu 
          shadow="md" 
          width="target"
          position="top-start"
          offset={10}
          withinPortal
          zIndex={10000}
        >
          <Menu.Target>
            <UnstyledButton style={{ width: '100%', padding: '8px', borderRadius: '8px' }} className="user-button-hover">
              <Group>
                <Avatar radius="xl" color="blue" size="md">
                    {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <Text size="sm" fw={500} truncate>{user?.username}</Text>
                  <Text c="dimmed" size="xs" truncate>{user?.email || 'User'}</Text>
                </div>
                <IconChevronRight style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{t('common:app.settings')}</Menu.Label>
            
            {/* Toggle Theme */}
            <Menu.Item 
              leftSection={colorScheme === 'dark' ? <IconSun size={14}/> : <IconMoon size={14}/>}
              onClick={() => toggleColorScheme()}
            >
              {colorScheme === 'dark' ? t('common:app.navigation.lightTheme') : t('common:app.navigation.darkTheme')}
            </Menu.Item>
            
            {/* Embedded Language Selector */}
            <Menu.Item 
              leftSection={<IconLanguage size={14}/>}
              rightSection={<Text size="xs" c="dimmed">{i18n.language.toUpperCase()}</Text>}
              onClick={() => changeLanguage(i18n.language === 'en' ? 'es' : 'en')}
            >
              {i18n.language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
            </Menu.Item>

            <Menu.Divider />
            
            <Menu.Item leftSection={<IconUser size={14} />} onClick={() => { navigate('/profile'); if(closeMobile) closeMobile(); }}>
               {t('common:userMenu.viewProfile')}
            </Menu.Item>
            
            <Menu.Item 
              color="red" 
              leftSection={<IconLogout size={14} />} 
              onClick={handleLogout}
            >
              {t('common:userMenu.logout')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </AppShell.Section>
    </>
  );
};

export default Sidebar;
