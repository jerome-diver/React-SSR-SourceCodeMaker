import React from 'react'
import { hydrate } from 'react-dom'
import { BrowserRouter } from "react-router-dom"
import { I18nextProvider } from 'react-i18next'
import '../node_modules/bootstrap/scss/bootstrap.scss'
import "./stylesheet/awesome.sass"
import './stylesheet/index.sass'
import './stylesheet/app.sass'
import i18n from '../backend/i18n'
import App from './App'
import { CookiesProvider } from 'react-cookie'

hydrate(
  <I18nextProvider i18n={i18n}>
    <CookiesProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </CookiesProvider>
  </I18nextProvider>
  , document.getElementById('root'));
