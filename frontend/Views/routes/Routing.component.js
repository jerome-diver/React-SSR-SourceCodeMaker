import React, { Component } from 'react'
import { Navbar, Nav, Dropdown, DropdownButton, NavDropdown } from 'react-bootstrap'
import { Route, NavLink } from "react-router-dom"
import { PrivateRoute } from './private/PrivateRoute.component'
import * as Icon from 'react-bootstrap-icons'

class Navigation extends Component {
  state = {}
  render () {
    const users = ``
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
              <NavDropdown title={<span><Icon.PeopleFill/> Users</span>} id="basic-nav-dropdown">
                <NavDropdown.Item href='/signin'>Sign in</NavDropdown.Item>
                <NavDropdown.Item href='/signup'>Sign up</NavDropdown.Item>
                <NavDropdown.Item href='/users'><Icon.PeopleFill/> Users list</NavDropdown.Item>
                <NavDropdown.Item href='/admin'><Icon.PersonBadge/> Admin</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </>
    )
  }
}

export { Navigation }
