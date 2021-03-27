import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { Button, Spinner, ListGroup } from 'react-bootstrap'
import { useAuth } from '../../../Controllers/context/authenticate'
import { getRoles, updateRole, deleteRole, createRole } from '../../../Controllers/roles/action-CRUD'

const Role = (props) => {

    const { role } = props

    const removeRole = () => {
      //
    }

    return (
      <>
        <ListGroup.Item id={role._id.toString()}>
          <h4><Badge pill variant={role.color}>{role.name}</Badge></h4>
          <hr/>
          <h5>Description</h5> 
          <p>{role.description}</p>
          <Button onClick={removeRole}>Remove</Button>
        </ListGroup.Item>
      </>
    )
}

const Admin = (props) => {
  const { setAuthTokens } = useAuth()
  const [users, setUsers] = useState([])
  const [load, setLoad] = useState(false)
    const [roles, setRoles] = useState([])

  useEffect( () => {
      console.log("UseEffect of AdminPage component call")
        getRoles().then(response => {
          if (response.error) { setError(response.error); setLoad(true); }
          else { setRoles(response.roles) }
        })
  }, [] )

  const logOut = () => { setAuthTokens() }
  const addRole = () => {
    //
  }

  if (load) {
    return (
      <>
        <h1><FontAwesomeIcon icon={faCoffee} size="xs" color="blue"/> Admin page</h1>
        <hr />
        <div id="Admin_manage_roles_board">
          <ListGroup>
            {roles.map( (role, index) => { return ( <Role key={index} role={role}/> ) } ) }
          </ListGroup>
          <Button onClick={addRole}>Add new role</Button>
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
