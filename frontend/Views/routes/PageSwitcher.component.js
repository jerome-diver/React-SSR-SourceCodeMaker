import React, { useEffect } from 'react'
import { Route, Switch } from "react-router-dom"
import PrivateRoute from './private/PrivateRoute.component'
import Home from '../Pages/public/Home.component'
import Contact from '../Pages/public/Contact.component'
import Containers from '../Pages/public/Containers.component'
import { useAuthenticate } from '../../Controllers/context/authenticate'
//import Subject from './public/Subject.component'
import Sign from "../Pages/public/Sign.component"
import Admin from '../Pages/private/Admin.component'
import Profile from '../Pages/private/Profile.component'
import Validate from '../Pages/public/Validate.component'
import SetupPassword from '../Pages/private/SetupPassword.component'
import ModifyEmail from '../Pages/private/ModifyEmail.component'

const PageSwitcher = (props) => {
    const { getUser, getRole, getLanguage } = useAuthenticate()

    useEffect(() => {
        console.log("--- PageSwitcher component useEffect")
    }, [])

    return (
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/contact" component={Contact}/>
            <Route path="/categories" component={(props) => <Containers {...props} type="category"/>}/>
            <Route path="/category/:id"
                   component={ (props) => <Containers {...props} type="category"
                                                                 children={{same: false, other: true}} /> } />
            <Route path="/subject/:id"
                   component={ (props) => <Containers {...props} type="subject"
                                                                 children={{same: false, other: true}}/> } />
            <PrivateRoute path="/admin" component={Admin} authority="Admin"/>
            <PrivateRoute path="/profile" 
                          component={(props) => <Profile {...props} userProfile={getUser()} 
                                                                    userRole={getRole()} />}/>
            <Route path="/signin" render={(props) => <Sign {...props} action="in" />} />
            <Route path="/signup" render={(props) => <Sign {...props} action="up" />}/>
            <PrivateRoute path="/signout" 
                          component={(props) => <Sign {...props} action="out" />}/>
            <Route path="/validate/:username/:token/:ticket" component={Validate}/>
            <PrivateRoute path="/setup_password/:id/:ticket" 
                          component={(props) => <SetupPassword {...props} /> }/>
            <PrivateRoute path='/modify_email/:id/:ticket/:new_email' 
                          component={(props) => <ModifyEmail {...props} /> }/>
      </Switch>
  )
}

    //<PrivateRoute path="/my_contents" component={MyContents}/>
export default PageSwitcher
