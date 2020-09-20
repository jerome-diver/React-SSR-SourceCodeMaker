import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
const enI18n = require('../locales/en.json')
const frI18n = require('../locales/fr.json')

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
 // .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
/*     resources: {
      en: enI18n,
      fr: frI18n,
    }, */
    fallbackLng: 'en',
    debug: true,
    react: { useSuspense: false },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: { loadPath: '../locales/{{lng}}.json' }
  });

/*   if (process.env.NODE_ENV !== 'production') {
    const { applyClientHMR } = require('i18next-hmr/client');
    applyClientHMR(i18n);
} */

export default i18n;