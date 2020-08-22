import React, { Component } from 'react'
import SignIn from '../../components/Signin'
import SignUp from '../../components/Signup'
import SignOut from '../../components/Signout'

const Sign = (props) => {

    switch (props.action) {
        case 'up':
          return ( <SignUp /> )
        case 'in':
          return ( <SignIn /> )
        case 'out':
          return ( <SignOut /> )
    }
}

export default Sign
