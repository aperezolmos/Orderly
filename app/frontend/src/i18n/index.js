import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


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
    resources: {},
  });


// Dynamically load namespaces
const loadNamespace = async (lng, ns) => {
  try {
    const module = await resources[lng][ns]();
    i18n.addResourceBundle(lng, ns, module.default);
  } 
  catch (error) {
    console.warn(`Could not load namespace ${ns} for language ${lng}`);
    console.error('Error loading namespace:', error)
  }
};

loadNamespace(i18n.language, 'common');


// Listen for language changes to load necessary namespaces
i18n.on('languageChanged', (lng) => {
  loadNamespace(lng, 'common');
});

export default i18n;
