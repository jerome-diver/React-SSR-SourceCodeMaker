import React, { useEffect, useState } from 'react'
import Navigation from './Views/routes/Navigation.component'
import PageSwitcher from './Views/routes/PageSwitcher.component'
import { useCookies } from 'react-cookie'
import './stylesheet/menu.sass'
import { AuthentifyContext } from './Controllers/context/authenticate'
import { cookie } from 'express-validator'

const App = (props) => {
  const [ cookies, setCookies, removeCookies ] = useCookies(['session'])

  useEffect( () => {
    console.log("APP get useEffect updated")
  }, [])
  
  const setUser = (data) => {
    console.log("Define username and role from", data)
    setCookies('session', data)
  }

  return (
    <>
      <AuthentifyContext.Provider value={{ userData: cookies.session, setAuthUser: setUser }}>
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
      </AuthentifyContext.Provider>
    </>
  )
}

export default App
