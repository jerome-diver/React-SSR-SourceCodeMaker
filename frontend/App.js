import React, { useEffect, useState } from 'react'
import Navigation from './Views/routes/Routing.component'
import PageSwitcher from './Views/Pages/PageSwitcher.component'
import './stylesheet/menu.sass'
import { AuthContext } from './Controllers/context/authenticate'
import { useCookies } from 'react-cookie'

const App = (props) => {
  const [authTokens, setAuthTokens] = useState({token: '', username: ''})
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'username'])

  useEffect( () => {
    console.log("APP get useEffect updated")
    setAuthTokens( { token: cookies.tokens,
                     username: cookies.username } )
  }, [])
  
  const setTokens = (data) => {
    if(data) {
      setCookie('token', JSON.stringify(data.token)) 
      setCookie('username', JSON.stringify(data.username)) }
    else { 
      removeCookie('token')
      removeCookie('username') }
    setAuthTokens(data)
  }

  return (
    <>
      <AuthContext.Provider value={{ data: authTokens, setAuthTokens: setTokens }}>
        <header>
          <Navigation className="menu"/></header>
        <main><PageSwitcher/></main>
        <footer>
            <hr />
            <div>Contacts</div>
        </footer>
      </AuthContext.Provider>
    </>
  )
}

export default App
