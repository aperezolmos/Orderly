import { IconSoup, IconCarrot, IconUsers, IconShield, IconDesk, 
         IconCalendar, IconShoppingCartPlus, IconLayoutDashboard, 
         IconList, IconPlus } from '@tabler/icons-react';
import { PERMISSIONS } from './permissions';


export const getNavigationConfig = (t) => [
  {
    id: 'orders',
    label: t('common:navigation.orders.name'),
    description: t('common:navigation.orders.description'),
    icon: IconShoppingCartPlus,
    color: 'blue',
    path: '/orders', // Main path (for cards)
    requiredPermission: PERMISSIONS.ORDER_VIEW,
    subItems: [
      { label: t('common:navigation.dashboard'), path: '/orders', icon: IconLayoutDashboard, requiredPermission: PERMISSIONS.ORDER_VIEW },
      { label: t('common:navigation.history'), path: '/orders/history', icon: IconList, requiredPermission: PERMISSIONS.ORDER_VIEW }
    ]
  },
  {
    id: 'products',
    label: t('common:navigation.products.name'),
    description: t('common:navigation.products.description'),
    icon: IconSoup,
    color: 'orange',
    path: '/products',
    requiredPermission: PERMISSIONS.PRODUCT_VIEW,
    subItems: [
      { label: t('common:app.create'), path: '/products/new', icon: IconPlus, requiredPermission: PERMISSIONS.PRODUCT_CREATE },
      { label: t('common:navigation.list'), path: '/products', icon: IconList, requiredPermission: PERMISSIONS.PRODUCT_VIEW }
    ]
  },
  {
    id: 'foods',
    label: t('common:navigation.foods.name'),
    description: t('common:navigation.foods.description'),
    icon: IconCarrot,
    color: 'green',
    path: '/foods',
    requiredPermission: PERMISSIONS.FOOD_VIEW,
    subItems: [
      { label: t('common:app.create'), path: '/foods/new', icon: IconPlus, requiredPermission: PERMISSIONS.FOOD_CREATE },
      { label: t('common:navigation.list'), path: '/foods', icon: IconList, requiredPermission: PERMISSIONS.FOOD_VIEW }
    ]
  },
  {
    id: 'reservations',
    label: t('common:navigation.reservations.name'),
    description: t('common:navigation.reservations.description'),
    icon: IconCalendar,
    color: 'pink',
    path: '/reservations',
    requiredPermission: PERMISSIONS.RESERVATION_VIEW,
    subItems: [
      { label: t('common:app.create'), path: '/reservations/new', icon: IconPlus, requiredPermission: PERMISSIONS.RESERVATION_CREATE },
      { label: t('common:navigation.list'), path: '/reservations', icon: IconList, requiredPermission: PERMISSIONS.RESERVATION_VIEW}
    ]
  },
  {
    id: 'tables',
    label: t('common:navigation.tables.name'),
    description: t('common:navigation.tables.description'),
    icon: IconDesk,
    color: 'cyan',
    path: '/tables',
    requiredPermission: PERMISSIONS.TABLE_VIEW,
    subItems: [
      { label: t('common:app.create'), path: '/tables/new', icon: IconPlus, requiredPermission: PERMISSIONS.TABLE_CREATE },
      { label: t('common:navigation.list'), path: '/tables', icon: IconList, requiredPermission: PERMISSIONS.TABLE_VIEW}
    ]
  },
  {
    id: 'users',
    label: t('common:navigation.users.name'),
    description: t('common:navigation.users.description'),
    icon: IconUsers,
    color: 'grape',
    path: '/users',
    requiredPermission: PERMISSIONS.USER_VIEW,
    subItems: [
      { label: t('common:app.create'), path: '/users/new', icon: IconPlus, requiredPermission: PERMISSIONS.USER_CREATE },
      { label: t('common:navigation.list'), path: '/users', icon: IconList, requiredPermission: PERMISSIONS.USER_VIEW }
    ]
  },
  {
    id: 'roles',
    label: t('common:navigation.roles.name'),
    description: t('common:navigation.roles.description'),
    icon: IconShield,
    color: 'violet',
    path: '/roles',
    requiredPermission: PERMISSIONS.ROLE_VIEW,
    subItems: [
      { label: t('common:app.create'), path: '/roles/new', icon: IconPlus, requiredPermission: PERMISSIONS.ROLE_CREATE },
      { label: t('common:navigation.list'), path: '/roles', icon: IconList, requiredPermission: PERMISSIONS.ROLE_VIEW }
    ]
  }
];


/**
 * Strict top-down filter: modules are hidden if the parent permission is missing, 
 * regardless of sub-item permissions.
 */
export const filterModulesByPermission = (modules, userPermissions) => {
  return modules
    .filter(m => !m.requiredPermission || userPermissions.includes(m.requiredPermission))
    .map(m => ({
      ...m,
      subItems: m.subItems?.filter(s => !s.requiredPermission || userPermissions.includes(s.requiredPermission))
    }));
};

/**
 * Content-driven filter: modules stay visible if at least one sub-item is permitted, 
 * bypassing the parent's own permission check.
 */
export const filterModulesBySubItemsPermissions = (modules, userPermissions) => {
  return modules
    .map(m => {
      const filteredSubItems = m.subItems?.filter(s => 
        !s.requiredPermission || userPermissions.includes(s.requiredPermission)
      ) || [];
      return { ...m, subItems: filteredSubItems };
    })
    .filter(m => {
      if (!m.subItems || m.subItems.length === 0) {
        return !m.requiredPermission || userPermissions.includes(m.requiredPermission);
      }
      
      return m.subItems.length > 0;
    });
};
