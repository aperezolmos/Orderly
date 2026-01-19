export const NUTRISCORE_IMAGES = {
  UNKNOWN: 'https://static.openfoodfacts.org/images/attributes/dist/nutriscore-unknown.svg',
  A: 'https://static.openfoodfacts.org/images/attributes/dist/nutriscore-a.svg',
  B: 'https://static.openfoodfacts.org/images/attributes/dist/nutriscore-b.svg',
  C: 'https://static.openfoodfacts.org/images/attributes/dist/nutriscore-c.svg',
  D: 'https://static.openfoodfacts.org/images/attributes/dist/nutriscore-d.svg',
  E: 'https://static.openfoodfacts.org/images/attributes/dist/nutriscore-e.svg',
};


export const NOVA_IMAGES = {
  UNKNOWN: 'https://static.openfoodfacts.org/images/attributes/dist/nova-group-unknown.svg',
  1: 'https://static.openfoodfacts.org/images/attributes/dist/nova-group-1.svg',
  2: 'https://static.openfoodfacts.org/images/attributes/dist/nova-group-2.svg',
  3: 'https://static.openfoodfacts.org/images/attributes/dist/nova-group-3.svg',
  4: 'https://static.openfoodfacts.org/images/attributes/dist/nova-group-4.svg',
};


const UNKNOWN_ALLERGEN_ICON = '/allergen_UNKNOWN.svg';

export function getAllergenIcon(allergen) {
  if (!allergen) return UNKNOWN_ALLERGEN_ICON;
  
  // Assumes the 'allergen' arrives as an uppercase string (e.g., 'GLUTEN', 'FISH')
  return `/allergen_${allergen}.svg`;
}

export { UNKNOWN_ALLERGEN_ICON };

export function getNutriScoreImage(nutri) {
  if (!nutri) return NUTRISCORE_IMAGES.UNKNOWN;
  const key = String(nutri).toUpperCase();
  return NUTRISCORE_IMAGES[key] || NUTRISCORE_IMAGES.UNKNOWN;
}

export function getNovaImage(nova) {
  if (!nova) return NOVA_IMAGES.UNKNOWN;
  const key = Number(nova);
  return NOVA_IMAGES[key] || NOVA_IMAGES.UNKNOWN;
}
