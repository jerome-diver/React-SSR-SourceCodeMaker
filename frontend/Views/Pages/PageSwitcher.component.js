import React, { Component } from 'react'
import { Route, Switch } from "react-router-dom"
import PrivateRoute from '../routes/private/PrivateRoute.component'
import Home from './public/Home.component'
import Contacts from './public/Contacts.component'
import Subjects from './public/Subjects.component'
//import Subject from './public/Subject.component'
import Users from './public/Users.component'
import Example from './public/Example.component'
import Sign from "./public/Sign.component"
import Admin from './private/Admin.component'
import Profile from './private/Profile.component'
import Validate from './public/Validate.component'

class PageSwitcher extends Component {
  state = {}
  render() {
    return (
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/contacts' component={Contacts}/>
          <Route path='/subjects' component={Subjects}/>
          <Route path='/users' component={Users}/>
          <Route path='/example' component={Example}/>
          <PrivateRoute path='/admin' component={Admin}/>
          <PrivateRoute path='/profile' render={(props) => <Profile {...props}/>}/>
          <Route path='/signin' render={(props) => <Sign {...props} action='in' />}/>
          <Route path='/signup' render={(props) => <Sign {...props} action='up' />}/>
          <Route path='/validate/:username/:ticket' component={Validate}/>
        </Switch>
    )
  }
}

export default PageSwitcher
