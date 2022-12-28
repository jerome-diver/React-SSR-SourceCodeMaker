import React, { useEffect } from 'react'
import { Route, Routes } from "react-router-dom"
import PrivateRoutes from './private/PrivateRoutes.component'
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
        <Routes>
            <Route path="/" element={<PrivateRoutes restricted="Admin" />} >
                <Route path="admin" element={<Admin />} />
            </ Route>
            <Route path="/" element={<PrivateRoutes />} >
                <Route path="profile" element={<Profile userProfile={getUser()} userRole={getRole()} />} />
                <Route path="signout" element={<Sign action="out" />}/>
                <Route path="setup_password/:id/:ticket" element={<SetupPassword />}/>
                <Route path='modify_email/:id/:ticket/:new_email' element={<ModifyEmail />}/>
            </Route>
            <Route exact path="/"       element={<Home />} />
            <Route path="contact"      element={<Contact />} />
            <Route path="categories"   element={<Containers type="category" />}/>
            <Route path="category/:id" element={<Containers type="category" children={{same: false, other: true}} />} />
            <Route path="subject/:id"  element={<Containers type="subject" children={{same: false, other: true}} />} />
            <Route path="signin"       element={<Sign action="in" />} />
            <Route path="signup"       element={<Sign action="up" />} />
            <Route path="validate/:username/:token/:ticket" element={<Validate />}/>
      </Routes>
  )
}

    //<PrivateRoute path="/my_contents" component={MyContents}/>
export default PageSwitcher
