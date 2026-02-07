export const ORDER_STATUSES = [
  'PENDING',
  'IN_PROGRESS',
  'READY',
  'SERVED',
  'PAID',
  'CANCELLED',
];

export const RESERVATION_STATUSES = [
  'CONFIRMED',
  'SEATED',
  'COMPLETED',
  'CANCELLED',
];

export const TABLE_STATUSES = [
  'ACTIVE',
  'INACTIVE',
];

const STATUS_COLORS = {
  // Orders
  'PENDING': 'yellow',
  'IN_PROGRESS': 'blue',
  'READY': 'green',
  'SERVED': 'teal',
  'PAID': 'gray',
  'CANCELLED': 'red',
  
  // Reservations
  'CONFIRMED': 'blue',
  'SEATED': 'green',
  'COMPLETED': 'gray',
  // CANCELLED already defined
  
  // Dining Tables
  'ACTIVE': 'green',
  'INACTIVE': 'gray',
};


const STATUS_NAMESPACE = {
  orders: 'orders',
  reservations: 'reservations',
  diningTables: 'diningTables',
};

const STATUS_TRANSLATION_KEY = {
  orders: (status) => `orders:status.${status}`,
  reservations: (status) => `reservations:status.${status}`,
  diningTables: (status) => `diningTables:list.${status.toLowerCase()}`,
};


export function getStatuses(module) {
  switch (module) {
    case 'orders': return ORDER_STATUSES;
    case 'reservations': return RESERVATION_STATUSES;
    case 'diningTables': return TABLE_STATUSES;
    default: return [];
  }
}

export function getStatusColor(status) {
  return STATUS_COLORS[status?.toUpperCase()] || 'gray';
}

export function getStatusTranslationKey(module, status) {
  const fn = STATUS_TRANSLATION_KEY[module];
  return fn ? fn(status) : status;
}

export function isValidStatus(module, status) {
  return getStatuses(module).includes(status);
}
