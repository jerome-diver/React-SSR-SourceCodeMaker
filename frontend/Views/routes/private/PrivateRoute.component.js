import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuthenticated } from '../../../Controllers/user/authenticate-helper'

const  PrivateRoute = (props) => {
    <Route path={props.path} component={ (props) => isAuthenticated ? ( <Component {...props} /> ) : 
                            ( <Redirect to={{ pathname: '/signin', state: { from: props.location } }} /> ) } />
}

export default PrivateRoute