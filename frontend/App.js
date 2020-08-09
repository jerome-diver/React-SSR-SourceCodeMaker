import React, { useEffect, useState } from 'react';
import { Navigation, Page } from './routes/Routing.component';
import { AuthContext } from './context/authenticate';

const App = (props) => {
    const existingTokens = {}
    const [authTokens, setAuthTokens] = useState(existingTokens)
    const setTokens = (data) => {
      if (typeof window !== 'undefined') {
            localStorage.setItem('tokens', JSON.stringify(data))
            setAuthTokens(data) }
      }

    useEffect( () => {
      if (typeof window !== 'undefined') {
        existingTokens = JSON.parse(localStorage.getItem('tokens'))
      }
    }, [] )

    return (
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
        <div className="App">
          <header>
            <Navigation class="menu"/></header>
          <main><Page/></main>
          <footer>
              <hr />
              <div>Contacts</div>
          </footer>
        </div>
      </AuthContext.Provider>
    );
}

export default App
