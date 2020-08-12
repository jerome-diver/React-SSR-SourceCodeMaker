import React, { useState, useEffect } from 'react'
import { list } from '../../../Controllers/user/action-api'
import { Jumbotron, ListGroup, Spinner, Badge } from 'react-bootstrap'
import '../../../stylesheet/users.sass'

const User = (props) => {
    const variant = (role) => {
        switch (role) {
            case 'Reader':
                return 'primary'
                break
            case 'Writer':
                return 'warning'
                break
            case 'Admin':
                return 'danger'
                break
        }
    }
    const role = props.data.role
    return (
        <ListGroup.Item id={props.data.id}>
          <h4>{props.data.username} <Badge pill variant={variant(role)}>{role}</Badge></h4>
          <hr/>
          <p>Email: {props.data.email}</p> 
          <p>First name: {props.data.first_name}</p>
          <p>Second name: {props.data.second_name}</p>
        </ListGroup.Item>
    )
}

const Users = () => {
    const [users, setUsers] = useState([])
    const [load, setLoad] = useState(false)
  
    useEffect( () => {
        const abort = new AbortController()
        const signal = abort.signal
        list(signal).then( (data) => {
            if (data && data.error) { console.log(data.error) } 
            else { setUsers(data) } } )
        setLoad(true)
        return function cleanup() { abort.abort() }
    }, [] )
  
    if (load) {
        return (
            <Jumbotron fluid id="users">
                <h1>Users list</h1>    
                <ListGroup>
                    {users.map((user, index) => {
                        return (<User data={user} />)
                    })}
                </ListGroup>
            </Jumbotron>
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

export default Users