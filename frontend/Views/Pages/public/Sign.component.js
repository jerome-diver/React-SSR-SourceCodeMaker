import React from 'react'
import SignIn from '../../components/Signin'
import SignUp from '../../components/Signup'
import SignOut from '../../components/Signout'

const Sign = ({action}) => {

    switch (action) {
        case 'up':
          return <SignUp />
        case 'in':
          return <SignIn />
        case 'out':
          return <SignOut />
        default:
          return <SignUp />
    }
}

export default Sign
