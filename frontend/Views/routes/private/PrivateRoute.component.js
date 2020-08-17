import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
//import { isAuthenticated } from '../../../Controllers/user/authenticate-helper'
import { useAuth } from '../../../Controllers/context/authenticate'

const  PrivateRoute = ({component: Component, ...rest}) => {

const isAuthenticated = useAuth()

    return (
        <Route {...rest} render={ 
        (props) => isAuthenticated 
            ? ( <Component {...props} /> ) 
            : ( <Redirect to={{ pathname: '/signin', state: { from: props.location } }} /> ) 
    } /> )
}

export default PrivateRoute