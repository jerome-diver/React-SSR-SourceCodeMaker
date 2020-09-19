import React, { useEffect } from 'react'
import Navigation from './Views/routes/Navigation.component'
import PageSwitcher from './Views/routes/PageSwitcher.component'
import { useCookies } from 'react-cookie'
import './stylesheet/menu.sass'
import { AuthenticateContext } from './Controllers/context/authenticate'

const App = (props) => {
  const [ cookies, setCookies, removeCookies ] = useCookies(['session'])

  useEffect( () => {
    console.log("APP get useEffect updated")
  }, [])
  
  const setSession = (data) => {  /// data: {user: ___, role: ___]}
    if(data != 0) {
      console.log("Define session cookie from", data)
      setCookies('session', data) }
    else {
      console.log("Reset session cookie")
      removeCookies('session') }
  }
  const getUser = () => { if (cookies.session) return cookies.session.user }
  const getRole = () => { if (cookies.session) return cookies.session.role }

  return (
    <>
      <AuthenticateContext.Provider value={{ getUser: getUser, getRole: getRole, setSession: setSession }}>
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
