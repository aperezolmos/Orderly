import { IconPackage, IconUsers, IconShield, IconDesk, 
         IconCalendar, IconChartBar, IconLayoutDashboard, 
         IconList, IconPlus } from '@tabler/icons-react';


export const getNavigationConfig = (t) => [
  {
    id: 'foods',
    label: t('common:navigation.foods.name'),
    description: t('common:navigation.foods.description'),
    icon: IconPackage,
    color: 'green',
    path: '/foods', // Main path (for cards)
    requiredRole: 'ROLE_ADMIN',
    subItems: [
      { label: t('common:app.create'), path: '/foods/new', icon: IconPlus },
      { label: t('common:navigation.list'), path: '/foods', icon: IconList }
    ]
  },
  {
    id: 'products',
    label: t('common:navigation.products.name'),
    description: t('common:navigation.products.description'),
    icon: IconPackage,
    color: 'orange',
    path: '/products',
    requiredRole: 'ROLE_ADMIN',
    subItems: [
      { label: t('common:app.create'), path: '/products/new', icon: IconPlus },
      { label: t('common:navigation.list'), path: '/products', icon: IconList }
    ]
  },
  {
    id: 'users',
    label: t('common:navigation.users.name'),
    description: t('common:navigation.users.description'),
    icon: IconUsers,
    color: 'blue',
    path: '/users',
    requiredRole: 'ROLE_ADMIN',
    subItems: [
      { label: t('common:app.create'), path: '/users/new', icon: IconPlus },
      { label: t('common:navigation.list'), path: '/users', icon: IconList }
    ]
  },
  {
    id: 'roles',
    label: t('common:navigation.roles.name'),
    description: t('common:navigation.roles.description'),
    icon: IconShield,
    color: 'violet',
    path: '/roles',
    requiredRole: 'ROLE_ADMIN',
    subItems: [
      { label: t('common:app.create'), path: '/roles/new', icon: IconPlus },
      { label: t('common:navigation.list'), path: '/roles', icon: IconList }
    ]
  },
  {
    id: 'tables',
    label: t('common:navigation.tables.name'),
    description: t('common:navigation.tables.description'),
    icon: IconDesk,
    color: 'cyan',
    path: '/tables',
    requiredRole: 'ROLE_ADMIN',
    subItems: [
      { label: t('common:app.create'), path: '/tables/new', icon: IconPlus },
      { label: t('common:navigation.list'), path: '/tables', icon: IconList }
    ]
  },
  {
    id: 'reservations',
    label: t('common:navigation.reservations.name'),
    description: t('common:navigation.reservations.description'),
    icon: IconCalendar,
    color: 'pink',
    path: '/reservations',
    requiredRole: 'ROLE_ADMIN',
    subItems: [
      { label: t('common:app.create'), path: '/reservations/new', icon: IconPlus },
      { label: t('common:navigation.list'), path: '/reservations', icon: IconList }
    ]
  },
  {
    id: 'orders',
    label: t('common:navigation.orders.name'),
    description: t('common:navigation.orders.description'),
    icon: IconChartBar,
    color: 'grape',
    path: '/orders',
    requiredRole: null,
    subItems: [
      { label: t('common:navigation.dashboard'), path: '/orders', icon: IconLayoutDashboard },
      { label: t('common:navigation.list'), path: '/orders/history', icon: IconList }
    ]
  }
];


export const filterModulesByRole = (modules, userRoleNames = []) => {
  return modules.filter(m => {
    if (!m.requiredRole) return true;
    return userRoleNames.includes(m.requiredRole);
  });
};
