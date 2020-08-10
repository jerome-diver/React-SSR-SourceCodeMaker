import React, { useEffect, useState } from 'react'
import { Navigation, Page } from './routes/Routing.component'
//import { AuthContext } from './context/authenticate'
import './stylesheet/menu.sass'

const App = (props) => {

    return (
        <div className="App">
          <header>
            <Navigation class="menu"/></header>
          <main><Page/></main>
          <footer>
              <hr />
              <div>Contacts</div>
          </footer>
        </div>
    )
}

export default App
