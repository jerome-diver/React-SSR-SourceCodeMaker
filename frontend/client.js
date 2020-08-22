import React from 'react'
import { hydrate } from 'react-dom'
import { BrowserRouter } from "react-router-dom"
import '../node_modules/bootstrap/scss/bootstrap.scss'
import "./stylesheet/awesome.sass"
import './stylesheet/index.sass'
import './stylesheet/app.sass'
import App from './App'
import { CookiesProvider } from 'react-cookie'

    hydrate(
    <CookiesProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </CookiesProvider>
    , document.getElementById('root'));
 // })
