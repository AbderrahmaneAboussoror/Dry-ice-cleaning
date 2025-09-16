// src/config/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources
import enTranslations from '../locales/en';
import daTranslations from '../locales/da';

const resources = {
    en: enTranslations,
    da: daTranslations
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',

        // Namespace configuration
        defaultNS: 'common',
        ns: ['common', 'navigation', 'auth', 'home', 'admin', 'profile'],

        interpolation: {
            escapeValue: false, // React already escapes by default
        },

        // Language detection options
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            lookupLocalStorage: 'i18nextLng',
            caches: ['localStorage'],
        },
    });

export default i18n;