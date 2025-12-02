import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


const loadedNamespaces = new Set();

const resources = {
  en: {
    common: () => import('./locales/en/common.json'),
    auth: () => import('./locales/en/auth.json'),
    roles: () => import('./locales/en/roles.json'),
    users: () => import('./locales/en/users.json'),
    foods: () => import('./locales/en/foods.json'),
    products: () => import('./locales/en/products.json'),
    diningTables: () => import('./locales/en/diningTables.json'),
    reservations: () => import('./locales/en/reservations.json'),
  },
  es: {
    common: () => import('./locales/es/common.json'),
    auth: () => import('./locales/es/auth.json'),
    roles: () => import('./locales/es/roles.json'),
    users: () => import('./locales/es/users.json'),
    foods: () => import('./locales/es/foods.json'),
    products: () => import('./locales/es/products.json'),
    diningTables: () => import('./locales/es/diningTables.json'),
    reservations: () => import('./locales/es/reservations.json'),
  },
};


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
    },
    
    resources: {},
  });


// Dynamically load namespaces
const loadNamespace = async (lng, ns) => {
  const cacheKey = `${lng}:${ns}`;
  if (loadedNamespaces.has(cacheKey)) return true;
  
  try {
    if (resources[lng]?.[ns]) {
      const module = await resources[lng][ns]();
      i18n.addResourceBundle(lng, ns, module.default);
      loadedNamespaces.add(cacheKey);
      return true;
    }
    return false;
  } 
  catch (error) {
    console.warn(`Could not load namespace ${ns} for language ${lng}:`, error);
    return false;
  }
};


// Preload essential namespaces (common + auth for auth pages)
const preloadEssentialNamespaces = async (lng) => {
  await Promise.all([
    loadNamespace(lng, 'common'),
    loadNamespace(lng, 'auth')
  ]);
};

preloadEssentialNamespaces(i18n.language);


// Listen for language changes to load necessary namespaces
i18n.on('languageChanged', async (lng) => {
  await preloadEssentialNamespaces(lng);

  // Trigger event for React to re-render
  i18n.emit('loaded');
});


// Utility for hooks/components
export const ensureNamespaceLoaded = async (ns) => {
  const currentLng = i18n.language;
  return await loadNamespace(currentLng, ns);
};

export const isNamespaceLoaded = (ns) => {
  return loadedNamespaces.has(`${i18n.language}:${ns}`);
};

export default i18n;
