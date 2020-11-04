import React, { useState, useEffect, useReducer } from 'react'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { NavLink, Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUserPlus, faUserCircle, faUserTie, 
        faUserEdit, faAddressCard, faFolder, faHome, 
        faSignInAlt} from '@fortawesome/free-solid-svg-icons'
import { useAuthenticate, isAuthorized } from '../../Controllers/context/authenticate'
import { useTranslation } from 'react-i18next'
import FlagFR from '../../img/flag-fr.svg'
import FlagUS from '../../img/flag-us.svg'
import FlagUK from '../../img/flag-uk.svg'

const getFlagFromLng = (lng) => {
    switch(lng) {
        case 'fr':
            return FlagFR
        case 'en':
            return FlagUK
        case 'us': 
            return FlagUS
        default:
            return FlagUK
    }
}

const imgFlag = (lang, size) => {
    const sized = `${size}px;`
    return (<img src={getFlagFromLng(lang)} height={sized}/>)
}

const reducer = (state, action) => {
    switch (action.user) {
        case undefined:
            return { user: '', username: '', role: '', language: 'en' }
        default:
            return { username: action.user.username,
                     role: action.role.name,
                     language: action.language }
    }
}

const I18nSelector = (props) => {
    const { flagLng, setFlagLng } = props
    console.log("--- I18nSelector (Navigation sub-component) flagLng props is", flagLng)
    const { i18n } = useTranslation()
    const { setLanguage } = useAuthenticate()
    const [ flagSelected, setFlagSelected ] = useState(imgFlag(i18n.language))

    useEffect(() => {
        console.log("--- I18nSelector [useEffect] (Navigation sub-menu) language is", i18n.language)
        setFlagSelected(imgFlag(i18n.language, 20))
    },[i18n.language])

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
        setFlagSelected(imgFlag(lng, 20))
        setFlagLng(lng)
        setLanguage(lng)
    }

    return <>
        <NavDropdown title={flagSelected} id="basic-nav-dropdown">
            <Link to='#' onClick={() => { changeLanguage('fr') } }>{imgFlag('fr',30)}</Link>
            <Link to='#' onClick={() => { changeLanguage('us') } }>{imgFlag('us', 30)}</Link>
            <Link to='#' onClick={() => { changeLanguage('en') } }>{imgFlag('uk', 30)}</Link>
        </NavDropdown>
    </>
}

const UserRoleEntries = (props) => {

    const { role } = props
    const { t } = useTranslation()

    console.log("--- UserRoleEntries navigation sub-menu role, role is:", role)
    
    switch (role) {
      case 'Admin':
        return <>
              <NavLink as={NavLink} to='/admin' activeClassName='menuselected'>
                <FontAwesomeIcon icon={faUserTie}/> {t('nav_bar.admin')}</NavLink>
              <NavLink as={NavLink} to='/users' activeClassName='menuselected'>
                <FontAwesomeIcon icon={faUsers}/> Users list</NavLink>
          </>
      default:
        return <></>
    }
}

const UserLoggedEntries = (props) => {

    const { username, role } = props
    const { t } = useTranslation()
  
    console.log("--- UserLogEntries navigation sub-menu users, username is:", username)
    if (username) {
      return (
        <>
          <NavLink as={NavLink} to={'/profile'}   activeClassName='menuselected'>
            <FontAwesomeIcon icon={faUserEdit}/> {t('nav_bar.profile')}</NavLink>
          <UserRoleEntries role={role} />
          <NavLink as={NavLink} to='/signout' activeClassName='menuselected'>
            <FontAwesomeIcon icon={faUserTie}/> {t('nav_bar.signout')}</NavLink>
        </>
      ) 
    } else {
      return (
        <>
          <NavLink as={NavLink} to='/signin' activeClassName='menuselected'>
            <FontAwesomeIcon icon={faSignInAlt}/> {t('nav_bar.signin')}</NavLink>
          <NavLink as={NavLink} to='/signup' activeClassName='menuselected'>
            <FontAwesomeIcon icon={faUserPlus}/> {t('nav_bar.signup')}</NavLink>
        </>
      )
  }
}

const Navigation = (props) => {

    const { i18n, t } = useTranslation()
    const { getUser, getRole, getLanguage } = useAuthenticate()
    const [ flagLng, setFlagLng ] = useState(getLanguage())
    console.log("--- Navigation component")
    const [ session, dispatch ] = useReducer(reducer, {username: '', role: '', language: i18n.language})

  useEffect( () => {
    dispatch({user: getUser(), role: getRole(), language: getLanguage()})
    setFlagLng(session.language)
  }, [getUser(), getLanguage()] )

  return (
    <>
        <Navbar expand="lg" bg="dark" fg="light" fixed="top">
            <Navbar.Brand href="">SourceCodeMaker</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link as={NavLink} to='/' exact activeClassName="menuselected">
                      <FontAwesomeIcon icon={faHome}/> {t('nav_bar.home')}</Nav.Link>
                  <Nav.Link as={NavLink} to='/subjects' activeClassName="menuselected">
                      <FontAwesomeIcon icon={faFolder}/> {t('nav_bar.subjects')}</Nav.Link>
                  <Nav.Link as={NavLink} to='/contact' activeClassName="menuselected">
                      <FontAwesomeIcon icon={faAddressCard}/> {t('nav_bar.contacts')}</Nav.Link>
                  <NavDropdown title={<span><FontAwesomeIcon 
                               icon={faUserCircle}/> {t('nav_bar.user_main')}</span>} 
                               id="basic-nav-dropdown">
                      <UserLoggedEntries username={session.username} role={session.role} />
                  </NavDropdown>
                  <I18nSelector flagLng={flagLng} setFlagLng={setFlagLng}/>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    </>
  )
}

export default Navigation
