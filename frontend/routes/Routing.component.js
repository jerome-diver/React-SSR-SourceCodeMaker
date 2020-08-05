import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, NavLink, Switch } from "react-router-dom";
import * as Icon from 'react-bootstrap-icons';
import Home from './Home.component';
import Contacts from './Contacts.component';
import Subjects from './Subjects.component';
//import Subject from './Subject.component';
import Users from './Users.component';
import Example from './Example.component';

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
              <Nav.Link as={NavLink} to='/users' activeClassName="menuselected">
                <Icon.PeopleFill/> Users</Nav.Link>
              <Nav.Link as={NavLink} to='/example' activeClassName="menuselected">
                <Icon.PeopleFill/> Example</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </>
    );
  }
}


class Page extends Component {
  state = {}
  render() {
    return (
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/contacts' component={Contacts}/>
            <Route path='/subjects' component={Subjects}/>
            <Route path='/users' component={Users}/>
            <Route path='/example' component={Example}/>
          </Switch>
    );
  }
}

export { Navigation, Page };
