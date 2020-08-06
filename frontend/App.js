import React, { Component } from 'react';
import { Navigation, Page } from './routes/Routing.component';

const App = () => {
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
    );
}

export default App
