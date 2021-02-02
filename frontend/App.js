import React, { useEffect, useState } from 'react'
import Navigation from './Views/routes/Navigation.component'
import PageSwitcher from './Views/routes/PageSwitcher.component'
import { useCookies } from 'react-cookie'
import { useTranslation } from 'react-i18next'
import { BrowserView, MobileView, isBrowser, isMobile } from "react-device-detect"
import './stylesheet/menu.sass'
import { Error} from './Views/Pages/public/Printers.component'
import { AuthenticateContext } from './Controllers/context/authenticate'
import useNavigatorLanguage from '@rooks/use-navigator-language'

const useFetch = (trigger) => {
    const [ error, setError ] = useState({state: false, message: ""})

    const fetchLanguage = async (language) => {
      const url = '/api/language/' + language
      fetch(url, { method: 'POST' }) 
          .catch(err => setError({state: true, content: err}))
    }

    useEffect( () => {
        fetchLanguage(trigger)
    }, [trigger])

    return { error, fetchLanguage }
}

const App = (props) => {
  const [ cookies, setCookies, removeCookies ] = useCookies(['session', 'token'])
  const { t, i18n } = useTranslation()
  const { error } = useFetch(i18n.language)
  const navigatorLanguage = useNavigatorLanguage()
  console.log("--- App component: language is %s, navigator language is %s", i18n.language, navigatorLanguage)

  const setSession = (data) => {  /// data: {user: ___, role: ___, language: ___}
    if (data != 0) {
      console.log("--- App component, Define session cookie from", data)
      setCookies('session', data) }
    else {
      console.log("--- App component, Reset session cookie")
      removeCookies('session') }
  }
  const setLanguage  = (lng) => {
      const language = (lng) 
                  ? lng
                  : (isBrowser) 
                    ? navigatorLanguage
                    : 'en'
      setCookies('session', {...cookies.session, language})
  }
  const setStatus = (status) => { 
    setCookies('session', {...cookies.session, status})
}
  const getUser = () => { if (cookies.session && cookies.session.user) return cookies.session.user }
  const getRole = () => { if (cookies.session && cookies.session.role) return cookies.session.role }
  const getLanguage = () => { if (cookies.session && cookies.session.language) return cookies.session.language }
  const getStatus = () => { if(cookies.session && cookies.session.status) return cookies.session.status }

  if(error.state) return <><Error title={t('error:home.title')} 
                                  name={error.content.name}
                                  message={error.content.message}/></>
  else {
      return (<>
          <AuthenticateContext.Provider value={{ getUser, getRole, getLanguage, getStatus,
                                                 setSession, setLanguage, setStatus }}>
            <header><Navigation className="menu"/></header>
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
      </>)
  }
}

export default App
