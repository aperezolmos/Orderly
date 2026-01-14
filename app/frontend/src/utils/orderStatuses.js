export const ORDER_STATUSES = [
  'PENDING',
  'IN_PROGRESS', 
  'READY',
  'SERVED',
  'PAID',
  'CANCELLED',
];

export const getStatusColors = () => {
  return {
    'PENDING': 'yellow',
    'IN_PROGRESS': 'blue',
    'READY': 'green', 
    'SERVED': 'teal',
    'PAID': 'gray',
    'CANCELLED': 'red',
  };
};

export const getStatusColor = (status) => {
  const colors = getStatusColors();
  return colors[status?.toUpperCase()] || 'gray';
};


export const useStatusColors = () => {
  return getStatusColors();
};

export const useStatusColor = (status) => {
  return getStatusColor(status);
};

export const getStatusTranslationKey = (status) => `orders:status.${status}`;

export const isValidOrderStatus = (status) => ORDER_STATUSES.includes(status);
