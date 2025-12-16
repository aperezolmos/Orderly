import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enRoles from './locales/en/roles.json';
import enUsers from './locales/en/users.json';
import enFoods from './locales/en/foods.json';
import enProducts from './locales/en/products.json';
import enDiningTables from './locales/en/diningTables.json';
import enReservations from './locales/en/reservations.json';

import esCommon from './locales/es/common.json';
import esAuth from './locales/es/auth.json';
import esRoles from './locales/es/roles.json';
import esUsers from './locales/es/users.json';
import esFoods from './locales/es/foods.json';
import esProducts from './locales/es/products.json';
import esDiningTables from './locales/es/diningTables.json';
import esReservations from './locales/es/reservations.json';


const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    roles: enRoles,
    users: enUsers,
    foods: enFoods,
    products: enProducts,
    diningTables: enDiningTables,
    reservations: enReservations,
  },
  es: {
    common: esCommon,
    auth: esAuth,
    roles: esRoles,
    users: esUsers,
    foods: esFoods,
    products: esProducts,
    diningTables: esDiningTables,
    reservations: esReservations,
  },
};


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
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
      useSuspense: false,
    },
  });

export default i18n;
