import React, { useEffect, useState } from 'react'
import Navigation from './Views/routes/Routing.component'
import PageSwitcher from './Views/Pages/PageSwitcher.component'
import './stylesheet/menu.sass'
import { AuthContext } from './Controllers/context/authenticate'

const App = (props) => {
  const [authTokens, setAuthTokens] = useState({})

  useEffect( () => {
    console.log("APP get useEffect updated")
    setAuthTokens(JSON.parse(localStorage.getItem("tokens")))
  }, [])
  
  const setTokens = (data) => {
    if(data) { localStorage.setItem("tokens", JSON.stringify(data)) }
    else { localStorage.removeItem('token') }
    setAuthTokens(data)
  }

  return (
    <>
      <AuthContext.Provider value={{ token: authTokens, setAuthTokens: setTokens }}>
        <header>
          <Navigation class="menu"/></header>
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
