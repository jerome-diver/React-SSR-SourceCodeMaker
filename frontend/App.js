import React, { useEffect } from 'react'
import Navigation from './Views/routes/Navigation.component'
import PageSwitcher from './Views/routes/PageSwitcher.component'
import { useCookies } from 'react-cookie'
import { getI18n } from 'react-i18next'
import './stylesheet/menu.sass'
import { AuthenticateContext } from './Controllers/context/authenticate'

const App = (props) => {
  const [ cookies, setCookies, removeCookies ] = useCookies(['session'])

  useEffect( () => {
      const i18n = getI18n()
      console.log("--- App language is", i18n.language)
  }, [])
  
  const setSession = (data) => {  /// data: {user: ___, role: ___, language: ___}
    if(data != 0) {
      console.log("--- App component, Define session cookie from", data)
      setCookies('session', data) }
    else {
      console.log("--- App component, Reset session cookie")
      removeCookies('session') }
  }
  const setLanguage  = (lng) => {
      var data = (cookies.session) ? { ...cookies.session, language: lng } : {language: lng}
      setCookies('session', data)
  }
  const getUser = () => { if (cookies.session && cookies.session.user) return cookies.session.user }
  const getRole = () => { if (cookies.session && cookies.session.role) return cookies.session.role }
  const getLanguage = () => { if (cookies.session && cookies.session.language) return cookies.session.language }

  return (
    <>
      <AuthenticateContext.Provider value={{ getUser: getUser, getRole: getRole, getLanguage: getLanguage,
                                             setSession: setSession, setLanguage: setLanguage }}>
        <header>
          <Navigation className="menu"/></header>
        <main><PageSwitcher/></main>
        <footer>
            <hr />
            <div id='foot-links'>
              <a target="_blank" rel="noreferrer noopener" 
                href="https://cloud.oceanus-amantum.net" >
                <span></span>Partagez avec moi via Nextcloud</a>
            </div>
        </footer>
      </AuthenticateContext.Provider>
    </>
  )
}

export default App
