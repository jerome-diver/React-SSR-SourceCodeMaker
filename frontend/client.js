import React, { Suspense } from 'react'
import { hydrate } from 'react-dom'
import { BrowserRouter } from "react-router-dom"
import '../node_modules/bootstrap/scss/bootstrap.scss'
import "./stylesheet/awesome.sass"
import './stylesheet/index.sass'
import './stylesheet/app.sass'
import App from './App'
import { Loading } from './Views/Pages/public/Printers.component'
import { CookiesProvider } from 'react-cookie'

const BaseAppI18n = () => {
  //useSSR(window.initialI18nStore, window.initialLanguage)
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
  <BaseAppI18n/>,
  document.getElementById('root'));
