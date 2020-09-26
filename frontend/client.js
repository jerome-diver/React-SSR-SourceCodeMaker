import React, { Suspense } from 'react'
import { hydrate } from 'react-dom'
import { BrowserRouter } from "react-router-dom"
import { I18nextProvider, useSSR } from 'react-i18next'
import '../node_modules/bootstrap/scss/bootstrap.scss'
import "./stylesheet/awesome.sass"
import './stylesheet/index.sass'
import './stylesheet/app.sass'
import App from './App'
import Loading from './Views/Pages/public/Loading.component'
import { CookiesProvider } from 'react-cookie'
//import { i18n } from '../backend/i18n'

export function InitSSR({ initialI18nStore, initialLanguage }) {
  useSSR(initialI18nStore, initialLanguage)
}

const BaseAppI18n = ({ initialI18nStore, initialLanguage }) => {
  useSSR(initialI18nStore, initialLanguage)
  return (
    <Suspense fallback={<Loading/>}>
      <CookiesProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
      </CookiesProvider>
    </Suspense>
  )
}

hydrate(
  <BaseAppI18n/>
  , document.getElementById('root'));
