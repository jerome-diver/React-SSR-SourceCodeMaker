import React, { useState, useEffect, useReducer } from 'react'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { NavLink, Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUserPlus, faUserCircle, faUserTie, 
        faUserEdit, faAddressCard, faFolder, faHome, 
        faSignInAlt} from '@fortawesome/free-solid-svg-icons'
import { useAuthenticate, isAuthorized } from '../../Controllers/context/authenticate'
import FlagFR from '../../img/flag-fr.svg'
import FlagUS from '../../img/flag-us.svg'
import FlagUK from '../../img/flag-uk.svg'


const reducer = (state, action) => {
  switch (action.user) {
    case undefined:
      return { user: action.user, username: '', role: '' }
    default:
      return { username: action.user.username,
               role: action.role.name }
  }
}

const I18nSelector = (props) => {
    const { selected } = props
    const [ flagSelected, setFlagSelected ] = useState(selected)

    useEffect(() => {
      console.log("---I18nSelector useEffect loop for", flagSelected)
    })

    const titleFlag = () => {
      return (
        <img src={selected} height='20px' />
      )
    }

    return (<>
        <NavDropdown title={<img src={flagSelected} height='20px' />} id="basic-nav-dropdown">
            <Link to='' onClick={() => { setFlagSelected(FlagFR) }} ><img src={FlagFR} height='30px' /></Link>
            <Link to='' onClick={() => { setFlagSelected(FlagUS) }} ><img src={FlagUS} height='30px' /></Link>
            <Link to='' onClick={() => { setFlagSelected(FlagUK) }} ><img src={FlagUK} height='30px' /></Link>
        </NavDropdown>
    </>)
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

    const { getUser, getRole } = useAuthenticate()
    const [ session, dispatch ] = useReducer(reducer, {username: '', role: ''})
    const [ flagSelected, setFlagSelected ] = useState(FlagUK)

  useEffect( () => {
    dispatch({user: getUser(), role: getRole()})
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
              <UserLoggedEntries username={session.username} 
                                 role={session.role} />
            </NavDropdown>
            <I18nSelector selected={flagSelected} />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

export default Navigation
