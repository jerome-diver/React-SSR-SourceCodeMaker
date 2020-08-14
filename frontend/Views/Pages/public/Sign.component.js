import React, { Component } from 'react'
import SignIn from '../../components/Signin'
import SignUp from '../../components/Signup'

const Sign = (props) => {

    switch (props.action) {
        case 'up':
          return ( <SignUp /> )
          break
        case 'in':
          return ( <SignIn /> )
          break
    }
}

export default Sign
