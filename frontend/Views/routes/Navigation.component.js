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
import Gravatar from 'react-gravatar'

const getFlagFromLng = (lng) => {
    switch(lng) {
        case 'fr':
            return FlagFR
            break
        case 'en':
            return FlagUK
            break
        case 'us': 
            return FlagUS
            break
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
            return { user: '', username: '', email: '', role: '', language: 'en' }
        default:
            return { username: action.user.username,
                     email: action.user.email,
                     role: action.role.name,
                     language: action.language }
    }
}

const I18nSelector = (props) => {
    const { i18n } = useTranslation()
    const { getUser, setLanguage } = useAuthenticate()
    const [ flagSelected, setFlagSelected ] = useState(imgFlag(i18n.language))
    console.log("--- I18nSelector (Navigation sub-component) flagLng props is", i18n.language)

    useEffect(() => {
        console.log("--- I18nSelector [useEffect] (Navigation sub-menu) language is", i18n.language)
        setFlagSelected(imgFlag(i18n.language, 20))
    },[i18n.language])

    const changeLanguage = lng => () => {
        console.log("CHANGING language to", lng)
        i18n.changeLanguage(lng)
        if (getUser()) {
            console.log("We got a user session existing...")
            setLanguage(lng)
        }
        setFlagSelected(imgFlag(lng, 20))
    }

    return <>
        <NavDropdown title={flagSelected} id="basic-nav-dropdown">
            <Link to='#' onClick={changeLanguage('fr')}>{imgFlag('fr', 30)}</Link>
            <Link to='#' onClick={changeLanguage('us')}>{imgFlag('us', 30)}</Link>
            <Link to='#' onClick={changeLanguage('en')}>{imgFlag('uk', 30)}</Link>
        </NavDropdown>
    </>
}

const UserRoleEntries = ({ role }) => {
    const { t } = useTranslation()
    console.log("--- UserRoleEntries navigation sub-menu role, role is:", role)
    
    switch (role) {
      case 'Admin':
        return <>
              <NavLink as={NavLink} to='/admin' activeClassName='menuselected'>
                <FontAwesomeIcon icon={faUserTie}/> {t('nav_bar.user.admin')}</NavLink>
              <NavLink as={NavLink} to='/users' activeClassName='menuselected'>
                <FontAwesomeIcon icon={faUsers}/>{t('nav_bar.user.list')}</NavLink>
          </>
      default:
        return <></>
    }
}

const UserEntries = ({ username, email, role }) => {
    const { t } = useTranslation()
    const [ title, setTitle ] = useState(<span>{username}</span>)
    console.log("--- UserLogEntries navigation sub-menu users, username is:", username)

    useEffect(() => {
      setTitle(<span><Gravatar email={email} size={18} default='mp'/> {username}</span>)
    }, [username])

    if (username) {
      return (
        <>
          <NavDropdown title={title}
                       id="basic-nav-dropdown">
            <NavLink as={NavLink} to={'/profile'}   activeClassName='menuselected'>
              <FontAwesomeIcon icon={faUserEdit}/> {t('nav_bar.user.profile')}</NavLink>
            <UserRoleEntries role={role} />
            <NavLink as={NavLink} to='/signout' activeClassName='menuselected'>
              <FontAwesomeIcon icon={faUserTie}/> {t('nav_bar.user.signout')}</NavLink>
          </NavDropdown>
        </>
      ) 
    } else {
      return (
        <>
          <NavDropdown title={<span><FontAwesomeIcon icon={faUserCircle}/> {t('nav_bar.user.main')}</span>}>
            <NavLink as={NavLink} to='/signin' activeClassName='menuselected'>
              <FontAwesomeIcon icon={faSignInAlt}/> {t('nav_bar.user.signin')}</NavLink>
            <NavLink as={NavLink} to='/signup' activeClassName='menuselected'>
              <FontAwesomeIcon icon={faUserPlus}/> {t('nav_bar.user.signup')}</NavLink>
          </NavDropdown>
        </>
      )
  }
}

const Navigation = (props) => {

    const { i18n, t } = useTranslation()
    const { getUser, getRole, getLanguage } = useAuthenticate()
    console.log("--- Navigation component")
    const [ session, dispatch ] = useReducer(reducer, {username: '', email: '', role: '', language: i18n.language})

  useEffect( () => {
    dispatch({user: getUser(), role: getRole(), language: getLanguage()})
  }, [getUser(), getLanguage()] )

  return (
    <>
        <Navbar expand="lg" bg="dark" fg="light" fixed="top">
            <Navbar.Brand id='brand' href="">SourceCodeMaker</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link as={NavLink} to='/' exact activeClassName="menuselected">
                      <FontAwesomeIcon icon={faHome}/> {t('nav_bar.home')}</Nav.Link>
                  <Nav.Link as={NavLink} to='/categories' activeClassName="menuselected">
                      <FontAwesomeIcon icon={faFolder}/> {t('nav_bar.contents')}</Nav.Link>
                  <Nav.Link as={NavLink} to='/contact' activeClassName="menuselected">
                      <FontAwesomeIcon icon={faAddressCard}/> {t('nav_bar.contacts')}</Nav.Link>
                  <UserEntries username={session.username} role={session.role} email={session.email} />
                  <I18nSelector/>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    </>
  )
}

export default Navigation
