import React, { useState, useEffect, useReducer } from 'react'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { NavLink, Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUserPlus, faUserCircle, faUserTie, 
        faUserEdit, faAddressCard, faFolder, faHome, 
        faSignInAlt} from '@fortawesome/free-solid-svg-icons'
import { useAuthenticate, isAuthorized } from '../../Controllers/context/authenticate'
import { useTranslation } from 'react-i18next'
import { useCookies } from 'react-cookie'
import FlagFR from '../../img/flag-fr.svg'
import FlagUS from '../../img/flag-us.svg'
import FlagUK from '../../img/flag-uk.svg'

const getFlagFromLng = (lng) => {
  console.log("LNG IS ", lng)
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

const ActualFlagLanguage = (props) => {
  const { flagLng } = props
  const [ flag, setFlag ] = useState(getFlagFromLng(flagLng))

  useEffect (() => {
    setFlag(getFlagFromLng(flagLng))
  }, [flagLng])

  return <>
      <img src={flag} height='20px' />
  </>
}

const I18nSelector = (props) => {
    const { flagLng, setFlagLng } = props
    console.log("--- I18nSelector (Navigation sub-component) flagLng props is", flagLng)
    const { i18n } = useTranslation()
    const [ cookies, setCookies, removeCookies ] = useCookies(['session'])
    const { getLanguage, setLanguage } = useAuthenticate()
    const [ flagSelected, setFlagSelected ] = useState(getFlagFromLng(flagLng))

    useEffect(() => {
        console.log("--- I18nSelector [useEffect] (Navigation sub-menu) language is", getLanguage(), i18n.language), flagLng
    },[flagSelected])

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
        setFlagSelected(getFlagFromLng(lng))
        setLanguage(lng)
        setFlagLng(lng)
        fetch('/api/language', { method: 'POST', 
                                 headers: {'Accept': 'application/json', 
                                           'Content-type': 'application/json'},
                                 body: JSON.stringify({language: lng}) })
             .then(response => response.json())
             .then(response => {
                if (response.language) {
                  console.log("OK, language change done with", response.language)
                }
             })
    }

    return <>
        <NavDropdown title={<ActualFlagLanguage flagLng={flagLng} />} id="basic-nav-dropdown">
            <Link to='#' onClick={() => { changeLanguage('fr') } }><img src={FlagFR} height='30px' /></Link>
            <Link to='#' onClick={() => { changeLanguage('us') } }><img src={FlagUS} height='30px' /></Link>
            <Link to='#' onClick={() => { changeLanguage('en') } } ><img src={FlagUK} height='30px' /></Link>
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
    const [ cookies, setCookies, removeCookies ] = useCookies(['session'])
    const { getUser, getRole, getLanguage } = useAuthenticate()
    const [ flagLng, setFlagLng ] = useState('')
    console.log("--- Navigation component")
    const [ session, dispatch ] = useReducer(reducer, {username: '', role: '', language: i18n.language})

  useEffect( () => {
    dispatch({user: getUser(), role: getRole(), language: getLanguage()})
    fetch('http://localhost:3000/api/language')
        .then(res => res.json())
        .then(res => { 
          console.log("--- Navigation [useEffect], language is:", session.language)
        })
  }, [getUser(), i18n.language] )

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
