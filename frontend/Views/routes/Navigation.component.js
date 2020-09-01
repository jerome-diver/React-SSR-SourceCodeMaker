import React, { useEffect, useState } from 'react'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { NavLink } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUserPlus, faUserCircle, faUserTie, 
        faUserEdit, faAddressCard, faFolder, faHome, 
        faSignInAlt} from '@fortawesome/free-solid-svg-icons'
import { useAuthentify, isAuthorized } from '../../Controllers/context/authenticate'

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

    const { getUser, setUserSession } = useAuthentify()
    const [ username, setUsername ] = useState('')
    const [ role, setRole ] = useState('')
/*   const [cookies, setCookie] = useCookies(['token', 'username'])
  console.log("From Navigation, decoded JWT token is", cookies)
  const [username, user_role] = (cookies && cookies.user) ? [cookies.user.username, cookies.user.role] : ['',''] */

  useEffect( () => {
    const user = getUser()
    if (user) {
      console.log("Find username:", user.username)
      setUsername(user.username)
      setRole(user.role.name)
    }
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
              <UserLoggedEntries username={username} 
                                 role={role} />
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

export default Navigation
