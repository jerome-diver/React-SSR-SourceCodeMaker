import React from 'react';
import { hydrate } from 'react-dom'
import { BrowserRouter } from "react-router-dom"
import '../node_modules/bootstrap/scss/bootstrap.scss';
import './stylesheet/index.sass'
import './stylesheet/menu.sass';
import './stylesheet/app.sass';
import App from './App';

  //const path = window.document.location.pathname;
  //const promises = getData(path);
  //console.log("get data : " + path)
  //const data = {};
  //Promise.all(promises).then(responses => {
  //  responses.forEach(r => {
  //      if (r) Object.assign(data, r);
  //  });
    hydrate(
        <BrowserRouter>
          <App />
        </BrowserRouter>
    , document.getElementById('root'));
 // })
