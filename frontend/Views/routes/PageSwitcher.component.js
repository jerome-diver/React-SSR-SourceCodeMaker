import React, { useEffect, useState } from 'react'
import { Route, Switch } from "react-router-dom"
import PrivateRoute from './private/PrivateRoute.component'
import Home from '../Pages/public/Home.component'
import Contact from '../Pages/public/Contact.component'
import Subjects from '../Pages/public/Subjects.component'
import { useAuthenticate } from '../../Controllers/context/authenticate'
import { getI18n } from 'react-i18next'
import { useCookies } from 'react-cookie'
//import Subject from './public/Subject.component'
import Users from '../Pages/public/Users.component'
import Sign from "../Pages/public/Sign.component"
import Admin from '../Pages/private/Admin.component'
import Profile from '../Pages/private/Profile.component'
import Validate from '../Pages/public/Validate.component'
import SetupPassword from '../Pages/public/SetupPassword.component'

const PageSwitcher = (props) => {
    const { getUser, getRole, getLanguage } = useAuthenticate()
    const [ cookies, setCookies, removeCookies ] = useCookies(['session'])
    const [ language, setLanguage ] = useState(getLanguage())
    const i18n = getI18n()

    useEffect(() => {
        console.log("--- PageSwitcher component useEffect refresh after i18n.language changed")
        const lng = (cookies.session && cookies.session.language) ? cookies.session.language : i18n.language
        i18n.changeLanguage(lng)
        setLanguage(lng)
    }, [])

    return (
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/contact" component={Contact}/>
            <Route path="/subjects" component={Subjects}/>
            <PrivateRoute path="/users" component={Users}/>
            <PrivateRoute path="/admin" component={Admin} authority="Admin"/>
            <PrivateRoute path="/profile" component={(props) => <Profile {...props} userProfile={getUser()} userRole={getRole()} />}/>
            <Route path="/signin" render={(props) => <Sign {...props} action="in" />} />
            <Route path="/signup" render={(props) => <Sign {...props} action="up" />}/>
            <PrivateRoute path="/signout" component={(props) => <Sign {...props} action="out" />}/>
            <Route path="/validate/:username/:token/:ticket" component={Validate}/>
            <Route path="/setup_password/:id/:ticket" component={SetupPassword}/>
      </Switch>
  )
}

export default PageSwitcher
