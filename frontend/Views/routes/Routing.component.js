import React, { useEffect, useState } from 'react'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { NavLink } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUserPlus, faUserCircle, faUserTie, 
        faUserEdit, faAddressCard, faFolder, faHome, 
        faSignInAlt} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../Controllers/context/authenticate'
import { useCookies } from 'react-cookie'

const UserLoggedEntries = (props) => {
  const { username } = props
  
  if (username !== '') {
    return (
      <>
        <NavLink as={NavLink} to={`/profile/${username}`}   activeClassName='menuselected'>
          <FontAwesomeIcon icon={faUserEdit}/> Profile</NavLink>
        <NavLink as={NavLink} to='/admin' activeClassName='menuselected'>
          <FontAwesomeIcon icon={faUserTie}/> Admin</NavLink>
        <NavLink as={NavLink} to='/users' activeClassName='menuselected'>
          <FontAwesomeIcon icon={faUsers}/> Users list</NavLink>
        <NavLink as={NavLink} to='/signout' activeClassName='menuselected'>
          <FontAwesomeIcon icon={faUserTie}/> Sign out</NavLink>
      </>
    ) 
  } else {
    return (
      <>
        <NavLink as={NavLink} to='/signin' activeClassName='menuselected'>
          <FontAwesomeIcon icon={faSignInAlt}/> Sign in</NavLink>
        <NavLink as={NavLink} to='/signup' activeClassName='menuselected'>
          <FontAwesomeIcon icon={faUserPlus}/> Sign up</NavLink>
      </>
    )
  }
}

const Navigation = (props) => {

  //const cookies = Cookies()
  const [cookies, setCookie] = useCookies(['token', 'username'])

  useEffect( () => {
    console.log("Find cookie's username:", cookies.username)
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
              <UserLoggedEntries username={cookies.username} />
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

export default Navigation
