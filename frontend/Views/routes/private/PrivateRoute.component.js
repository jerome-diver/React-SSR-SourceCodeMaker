import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
//import { isAuthenticated } from '../../../Controllers/user/authenticate-helper'
import { useAuth } from '../../../Controllers/context/authenticate'

const  PrivateRoute = ({component: Component, ...rest}) => {

    const authTokens = useAuth()
    console.log("Private route is running, with authTokens:", authTokens)

    return (
        <Route {...rest} render={ 
        (props) => (authTokens.token !== '') ? 
            ( <Component {...props} /> ) :
            ( <Redirect to={{ pathname: '/signin', 
                              state: { referer: props.location, error: 'Failed to authenticate Tokens'}
                               }} 
                         /> )
    } /> )
}

export default PrivateRoute