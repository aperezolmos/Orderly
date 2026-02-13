export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

export const formatTime = (dateTime) => {
  if (!dateTime) return '';
  return new Date(dateTime).toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatValue = (val) => {
  if (val === null || val === undefined) return '-';
  return Number(val.toFixed(3));
};
