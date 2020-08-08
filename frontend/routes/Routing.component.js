import React, { Component } from 'react'
import { Navbar, Nav, Dropdown, DropdownButton } from 'react-bootstrap'
import { Route, NavLink, Switch } from "react-router-dom"
import { PrivateRoute } from '../privateRoutes/PrivateRoute.component'
import * as Icon from 'react-bootstrap-icons'
import Home from './Home.component'
import Contacts from './Contacts.component'
import Subjects from './Subjects.component'
//import Subject from './Subject.component'
import Users from './Users.component'
import Example from './Example.component'
import AdminPage from '../privateRoutes/Admin.component'
import Sign from "./Sign.component"

class Navigation extends Component {
  state = {}
  render () {
    return (
      <>
        <Navbar expand="lg" bg="dark" fg="light" fixed="top">
          <Navbar.Brand href="">SourceCodeMaker</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={NavLink} to='/' exact activeClassName="menuselected">
                <Icon.House/> Home</Nav.Link>
              <Nav.Link as={NavLink} to='/subjects' activeClassName="menuselected">
                <Icon.ListNested/> Subjects</Nav.Link>
              <Nav.Link as={NavLink} to='/contacts' activeClassName="menuselected">
                <Icon.PersonLinesFill/> Contacts</Nav.Link>
              <Nav.Link as={NavLink} to='/example' activeClassName="menuselected">
                <Icon.PeopleFill/> Example</Nav.Link>
              <UserNav />
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </>
    )
  }
}

class UserNav extends Component {
  state = {}
  render () {
    return (
      <>
        <DropdownButton id='dropdown-basic-button' title="User">
          <Dropdown.Item href='/signin'>Sign in</Dropdown.Item>
          <Dropdown.Item href='/signup'>Sign up</Dropdown.Item>
          <Dropdown.Item href='/users'><Icon.PeopleFill/> Users list</Dropdown.Item>
          <Dropdown.Item href='/admin'><Icon.PersonBadge/> Admin</Dropdown.Item>
        </DropdownButton>
      </>
    )
  }
}

class Page extends Component {
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
            <PrivateRoute path='/admin' render={AdminPage}/>
            <Route path='/signin' component={(props) => <Sign {...props} action='in' />}/>
            <Route path='/signup' component={(props) => <Sign {...props} action='up' />}/>
          </Switch>
    );
  }
}

export { Navigation, UserNav, Page };
