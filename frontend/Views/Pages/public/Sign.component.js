import React, { Component } from 'react'
import SignIn from '../../components/Signin'
import SignUp from '../../components/Signup'

class Sign extends Component {
  state = { content: "" }

  componentDidMount() {  // get HTML content from Pug contacts template
    console.log("did Mount SignIn component")
  }

  componentDidUpdate() {  // add discrete button event listener out of template
    console.log("did Update contacts component")
  }

  render() {
    switch (this.props.action) {
        case 'up':
          return ( <SignUp /> )
          break
        case 'in':
          return ( <SignIn /> )
          break
    }
  }
}

export default Sign
