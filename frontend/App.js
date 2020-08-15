import React, { useEffect, useState } from 'react'
import Navigation from './Views/routes/Routing.component'
import PageSwitcher from './Views/Pages/PageSwitcher.component'
import './stylesheet/menu.sass'

const App = (props) => {

    return (
        <>
          <header>
            <Navigation class="menu"/></header>
          <main><PageSwitcher/></main>
          <footer>
              <hr />
              <div>Contacts</div>
          </footer>
        </>
    )
}

export default App
