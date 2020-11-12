import React, { useEffect } from 'react'
import Navigation from './Views/routes/Navigation.component'
import PageSwitcher from './Views/routes/PageSwitcher.component'
import { useCookies } from 'react-cookie'
import { useTranslation } from 'react-i18next'
import { BrowserView, MobileView, isBrowser, isMobile } from "react-device-detect"
import './stylesheet/menu.sass'
import { AuthenticateContext } from './Controllers/context/authenticate'
import useNavigatorLanguage from '@rooks/use-navigator-language'

const App = (props) => {
  const [ cookies, setCookies, removeCookies ] = useCookies(['session', 'token'])
  const { t } = useTranslation()
  const navigatorLanguage = useNavigatorLanguage()

  useEffect( () => {
      console.log("--- App component: language is %s, navigator language is %s", getLanguage(), navigatorLanguage)
  }, [])
  
  const setSession = (data) => {  /// data: {user: ___, role: ___, language: ___}
    if (data != 0) {
      console.log("--- App component, Define session cookie from", data)
      setCookies('session', data) }
    else {
      console.log("--- App component, Reset session cookie")
      removeCookies('session') }
  }
  const setLanguage  = (language) => {
      let data = (!language) 
                  ? (isBrowser) 
                    ? { language: navigatorLanguage } 
                    : { language: 'en' }
                  : { language }
      if (cookies.session) { data = {...cookies.session, data } }
      setCookies('session', data)
      fetch('/api/language', { method: 'POST', 
                               headers: {'Accept': 'application/json', 
                                         'Content-type': 'application/json'},
                               body: JSON.stringify({language: data.language}) })
          .then(response => response.json())
          .then(response => {
              if (response.language) {
                  console.log("--- App, (SetLanguage POST request), response:", response.language)
              }
          })
  }
  const setStatus = (status) => { 
    let data
    if (cookies.session) {
        data = (cookies.session.status) 
            ? {...cookies.session, status: { ...cookies.session.status, ...status } } 
            : {...cookies.session, status }
    } else { data = { status } }
    setCookies('session', data)
}
  const getUser = () => { if (cookies.session && cookies.session.user) return cookies.session.user }
  const getRole = () => { if (cookies.session && cookies.session.role) return cookies.session.role }
  const getLanguage = () => { 
      if (cookies.session && cookies.session.language) return cookies.session.language
      else return (isBrowser) ? navigatorLanguage : 'en'
  }
  const getStatus = () => { if(cookies.session && cookies.session.status) return cookies.session.status }

  return (
    <>
      <AuthenticateContext.Provider value={{ getUser, getRole, getLanguage, getStatus,
                                             setSession, setLanguage, setStatus }}>
        <header>
          <Navigation className="menu"/></header>
        <main><PageSwitcher/></main>
        <footer>
            <hr />
            <div id='foot-links'>
              <a target="_blank" rel="noreferrer noopener" 
                href="https://cloud.oceanus-amantum.net" >
                <span></span>{t('general.share.nextcloud')}</a>
            </div>
        </footer>
      </AuthenticateContext.Provider>
    </>
  )
}

export default App
