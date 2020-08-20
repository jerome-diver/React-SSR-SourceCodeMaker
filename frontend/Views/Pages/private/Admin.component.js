import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { Button, Spinner } from 'react-bootstrap'
import { useAuth } from '../../../Controllers/context/authenticate'

const Admin = (props) => {
  const { setAuthTokens } = useAuth()
  const [user, setUser] = useState({username: "", first_name: "", second_name: "", email: ""})
  const [load, setLoad] = useState(false)

  useEffect( () => {
      console.log("UseEffect of AdminPage component call")
      fetch("http://localhost:3000/api/admin")
        .then(res => res.json())
        .then(response => {
            setUser( { 
              username: response.username,
              first_name: response.first_name,
              second_name: response.second_name,
              email: response.email } )
            setLoad(true) } )
  }, [] )

  const logOut = () => { setAuthTokens() }

  if (load) {
    return (
      <>
        <h1><FontAwesomeIcon icon={faCoffee} size="xs" color="blue"/> {user.username}</h1>
        <hr />
        <div id="Admin_board">
          <p>First name: {user.first_name}</p>
          <p>Second name: {user.second_name}</p>
          <p>Email: {user.email}</p>
        </div>
        <Button onClick={logOut}>Log out</Button>
      </>
    )
  } else {
    return (
      <>
        <Spinner animation='border' role='status'/>
        <p>Loading...</p>
      </>
    )
  }
}

export default Admin
