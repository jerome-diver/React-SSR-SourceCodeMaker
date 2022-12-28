import React, { useState, useEffect, useReducer } from 'react'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { NavLink, Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUserPlus, faUserCircle, faUserTie, 
         faUserEdit, faAddressCard, faFolder, faHome, 
         faSignInAlt, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'
import { useAuthenticate, isAuthorized } from '../../Controllers/context/authenticate'
import { useTranslation } from 'react-i18next'
import FlagFR from '../../img/flag-fr.svg'
import FlagUS from '../../img/flag-us.svg'
import FlagUK from '../../img/flag-uk.svg'
import { getGravatarUrl } from 'react-awesome-gravatar';

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
        setFlagSelected(imgFlag(i18n.language, 20))
    },[i18n.language])

    const changeLanguage = lng => () => {
        i18n.changeLanguage(lng)
        if (getUser()) { setLanguage(lng) }
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
        return (
            <Nav.Link as={NavLink} to='/admin' className='menuselected'>
                <FontAwesomeIcon icon={faUserTie}/> {t('nav_bar.user.admin')}</Nav.Link>
          )
      case 'Writer':
         return (
             <Nav.Link as={NavLink} to='/my_contents' className='menuselected'>
                 <FontAwesomeIcon icon={faUsers}/>{t('nav_bar.user.list')}</Nav.Link>
         )
      default:
        return <></>
    }
}

const UserEntries = ({ username, email, role }) => {
    const { t } = useTranslation()
    const [ avatar, setAvatar ] = useState(<FontAwesomeIcon icon={faUserCircle} style={{margin: '4px'}}/>)

    useEffect(() => {
      const options = {size: 18, default: 'mp'}
      const gravatar = getGravatarUrl(email, options)
      setAvatar(<img src={gravatar} className='mr-2'/>)
    }, [username])

    if (username) {
      return (<>
          <NavDropdown title={<span>{avatar}{username}</span>}
                       id="basic-nav-dropdown">
            <Nav.Link as={NavLink} to={'/profile'} className='menuselected'>
              <FontAwesomeIcon icon={faUserEdit}/> {t('nav_bar.user.profile')}</Nav.Link>
            <UserRoleEntries role={role} />
            <Nav.Link as={NavLink} to='/signout' className='menuselected'>
              <FontAwesomeIcon icon={faSignOutAlt}/> {t('nav_bar.user.signout')}</Nav.Link>
          </NavDropdown>
      </>)
    }
    return (<>
        <NavDropdown title={<span>{avatar}{t('nav_bar.user.main')}</span>}>
          <Nav.Link as={NavLink} to='/signin' className='menuselected'>
            <FontAwesomeIcon icon={faSignInAlt}/> {t('nav_bar.user.signin')}</Nav.Link>
          <Nav.Link as={NavLink} to='/signup' className='menuselected'>
            <FontAwesomeIcon icon={faUserPlus}/> {t('nav_bar.user.signup')}</Nav.Link>
        </NavDropdown>
    </>)
}

const Navigation = (props) => {

    const { i18n, t } = useTranslation()
    const { getUser, getRole, getLanguage } = useAuthenticate()
    console.log("--- Navigation component")
    const [ session, dispatch ] = useReducer(reducer, {username: '', email: '', role: '', language: i18n.language})

  useEffect( () => {
    dispatch({user: getUser(), role: getRole(), language: getLanguage()})
  }, [getUser, getLanguage, getRole] )

  return (
    <>
        <Navbar expand="lg" bg="dark" fg="light" fixed="top">
            <Navbar.Brand id='brand' href="">SourceCodeMaker</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link as={NavLink} to='/' exact className="menuselected">
                      <FontAwesomeIcon icon={faHome}/> {t('nav_bar.home')}</Nav.Link>
                  <Nav.Link as={NavLink} to='/categories' className="menuselected">
                      <FontAwesomeIcon icon={faFolder}/> {t('nav_bar.contents')}</Nav.Link>
                  <Nav.Link as={NavLink} to='/contact' className="menuselected">
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
