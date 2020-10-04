import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
//const FilesystemBackend = require('i18next-fs-backend')
//const i18nextMiddleware = require('i18next-http-middleware')
const enI18n = require('../locales/en/translation.json')
const frI18n = require('../locales/fr/translation.json')
const enI18nMailer = require('../locales/en/mailer.json')
const frI18nMailer = require('../locales/fr/mailer.json')
const enI18nError = require('../locales/en/error.json')
const frI18nError = require('../locales/fr/error.json')

const options = {
    whiteList: ['en', 'fr', 'th'],
    fallbackLng: 'en',
    //preload: ['en', 'fr'],
    ns: ['translation', 'mailer', 'error'],
    defaultNS: 'translation',
    load: 'languageOnly',
    react: { useSuspense: false },
    wait: process && process.release
  }

/*   if (process.env.NODE_ENV !== 'production') {
    const { applyClientHMR } = require('i18next-hmr/client');
    applyClientHMR(i18n);
} */
if (process && !process.release) {
    i18n.use(Backend).use(initReactI18next).use(LanguageDetector)
}

if (!i18n.isInitialized) { i18n.init(options) }

export { i18n, options }