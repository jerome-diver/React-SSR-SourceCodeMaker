import React, { useEffect, useState } from 'react'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { NavLink } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUserPlus, faUserCircle, faUserTie, 
        faUserEdit, faAddressCard, faFolder, faHome, 
        faSignInAlt} from '@fortawesome/free-solid-svg-icons'

const Navigation = (props) => {

  let [username, setUsername] = useState('')

  useEffect( () => {
    //
  }, [] )

  return (
    <>
      <Navbar expand="lg" bg="dark" fg="light" fixed="top">
        <Navbar.Brand href="">SourceCodeMaker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={NavLink} to='/' exact activeClassName="menuselected">
              <FontAwesomeIcon icon={faHome}/> Home</Nav.Link>
            <Nav.Link as={NavLink} to='/subjects' activeClassName="menuselected">
              <FontAwesomeIcon icon={faFolder}/> Subjects</Nav.Link>
            <Nav.Link as={NavLink} to='/contact' activeClassName="menuselected">
              <FontAwesomeIcon icon={faAddressCard}/> Contact</Nav.Link>
            <NavDropdown title={<span><FontAwesomeIcon icon={faUserCircle}/> Users</span>} id="basic-nav-dropdown">
                <NavLink as={NavLink} to='/signin' activeClassName='menuselected'>
                  <FontAwesomeIcon icon={faSignInAlt}/> Sign in</NavLink>
                <NavLink as={NavLink} to='/signup' activeClassName='menuselected'>
                  <FontAwesomeIcon icon={faUserPlus}/> Sign up</NavLink>
                <NavLink as={NavLink} to='/users' activeClassName='menuselected'>
                  <FontAwesomeIcon icon={faUsers}/> Users list</NavLink>
                <NavLink as={NavLink} to={`/profile/${username}`}   activeClassName='menuselected'>
                  <FontAwesomeIcon icon={faUserEdit}/> Profile</NavLink>
                <NavLink as={NavLink} to='/admin' activeClassName='menuselected'>
                <FontAwesomeIcon icon={faUserTie}/> Admin</NavLink>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

export default Navigation
