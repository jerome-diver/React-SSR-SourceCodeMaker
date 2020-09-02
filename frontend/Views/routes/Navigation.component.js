import React, { useEffect, useReducer } from 'react'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { NavLink } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUserPlus, faUserCircle, faUserTie, 
        faUserEdit, faAddressCard, faFolder, faHome, 
        faSignInAlt} from '@fortawesome/free-solid-svg-icons'
import { useAuthenticate, isAuthorized } from '../../Controllers/context/authenticate'

const reducer = (state, action) => {
  switch (action.user) {
    case undefined:
      return { user: action.user, username: '', role: '' }
    default:
      return { username: action.user.username,
               role: action.user.role.name }
  }
}

const UserRoleEntries = (props) => {

  const { role } = props

  console.log("Sub-menu role, role is:", role)
  
  switch (role) {
    case 'Admin':
      return (
        <>
            <NavLink as={NavLink} to='/admin' activeClassName='menuselected'>
              <FontAwesomeIcon icon={faUserTie}/> Admin</NavLink>
            <NavLink as={NavLink} to='/users' activeClassName='menuselected'>
              <FontAwesomeIcon icon={faUsers}/> Users list</NavLink>
        </>
      )
      break
    default:
      return (<></>)
  }
}

const UserLoggedEntries = (props) => {
  const { username, role } = props
  
  console.log("Sub-menu users, username is:", username)
  if (username) {
    return (
      <>
        <NavLink as={NavLink} to={'/profile'}   activeClassName='menuselected'>
          <FontAwesomeIcon icon={faUserEdit}/> Profile</NavLink>
        <UserRoleEntries role={role} />
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

    const { getUser, setUserSession } = useAuthenticate()
    const [ user, dispatch ] = useReducer(reducer, {username: '', role: ''})

  useEffect( () => {
    dispatch({user: getUser()})
  }, [getUser()] )

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
              <UserLoggedEntries username={user.username} 
                                 role={user.role} />
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

export default Navigation
