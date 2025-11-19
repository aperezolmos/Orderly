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
  },
  es: {
    common: () => import('./locales/es/common.json'),
    auth: () => import('./locales/es/auth.json'),
    roles: () => import('./locales/es/roles.json'),
    users: () => import('./locales/es/users.json'),
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
    },
    
    resources: {},
  });


// Dynamically load namespaces
const loadNamespace = async (lng, ns) => {
  const cacheKey = `${lng}:${ns}`;
  
  if (loadedNamespaces.has(cacheKey)) {
    return;
  }

  try {
    if (resources[lng]?.[ns]) {
      const module = await resources[lng][ns]();
      i18n.addResourceBundle(lng, ns, module.default);
      loadedNamespaces.add(cacheKey);
    }
  } 
  catch (error) {
    console.warn(`Could not load namespace ${ns} for language ${lng}:`, error);
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
i18n.on('languageChanged', (lng) => {
  preloadEssentialNamespaces(lng);
});

export default i18n;
