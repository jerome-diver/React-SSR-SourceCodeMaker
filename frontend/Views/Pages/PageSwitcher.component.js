import React, { Component } from 'react'
import { DropdownButton } from 'react-bootstrap'
import { Route, Switch } from "react-router-dom"
import { PrivateRoute } from '../routes/private/PrivateRoute.component'
import Home from './public/Home.component'
import Contacts from './public/Contacts.component'
import Subjects from './public/Subjects.component'
//import Subject from './public/Subject.component'
import Users from './public/Users.component'
import Example from './public/Example.component'
import Sign from "./public/Sign.component"
import Admin from './private/Admin.component'
import Profile from './private/Profile.component'

class PageSwitcher extends Component {
  state = {}
  render() {
    const signup = <Sign action='up'/>
    return (
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/contacts' component={Contacts}/>
          <Route path='/subjects' component={Subjects}/>
          <Route path='/users' component={Users}/>
          <Route path='/example' component={Example}/>
          <PrivateRoute path='/admin' component={Admin}/>
          <PrivateRoute path='/profile' component={(props) => <Profile {...props}/>}/>
          <Route path='/signin' component={(props) => <Sign {...props} action='in' />}/>
          <Route path='/signup' component={(props) => <Sign {...props} action='up' />}/>
        </Switch>
    )
  }
}

export { PageSwitcher }
