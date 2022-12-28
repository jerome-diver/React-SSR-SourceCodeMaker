import React, { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import App from './App'
import { CookiesProvider } from 'react-cookie'
import { Provider } from 'react-redux'
import store from './Redux/store'
import '../node_modules/bootstrap/scss/bootstrap.scss'
import "./stylesheet/awesome.sass"
import './stylesheet/index.sass'

const unSubscribe = store.subscribe(() => {
  console.log("*** store state is: %s ***", store.getState())
})


const BaseAppI18n = () => {
  //useSSR(window.initialI18nStore, window.initialLanguage)
  return (
      <CookiesProvider>
        <Provider store={store}>
          {/* <StrictMode> */}
            <BrowserRouter>
              <App />
            </BrowserRouter>
          {/* </StrictMode> */}
        </Provider>
      </CookiesProvider>
  )
}

const container = document.getElementById('root')
hydrateRoot(container, <BaseAppI18n/>)
export default BaseAppI18n
