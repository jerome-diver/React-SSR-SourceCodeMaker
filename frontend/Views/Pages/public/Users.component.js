import React, { useState, useEffect } from 'react'
import { list } from '../../../Controllers/user/action-api'
import { Jumbotron, ListGroup, Spinner, Badge } from 'react-bootstrap'
import '../../../stylesheet/users.sass'

const User = (props) => {
    const { user } = props
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
    const role = user.role
    return (
        <ListGroup.Item id={user.id}>
          <h4>{user.username} <Badge pill variant={variant(role)}>{role}</Badge></h4>
          <hr/>
          <p>Email: {user.email}</p> 
          <p>First name: {user.first_name}</p>
          <p>Second name: {user.second_name}</p>
        </ListGroup.Item>
    )
}

const Users = () => {
    const [users, setUsers] = useState([])
    const [load, setLoad] = useState(0)
    const [error, setError] = useState('')
  
    useEffect( () => {
        const abort = new AbortController()
        const signal = abort.signal
        list(signal).then( (data) => {
            if (data) {
                if (data.error) { 
                    setLoad(2)
                    setError(data.error) } 
                else { 
                    setUsers(data)
                    setLoad(1) } }
            else { 
                setLoad(2)
                setError('Empty answer') } } )
        return function cleanup() { abort.abort() }
    }, [] )
  
    switch (load) {
        case 0:     // loading run
            return (
                <>
                    <Spinner animation='border' role='status'/>
                    <p>Loading...</p>
                </>
            )
            break
        case 1:     // loaded
            return (
                <Jumbotron fluid id="users">
                    <h1>Users list</h1>    
                    <ListGroup>
                        {users.map((user, index) => {
                            return (<User user={user} />)
                        })}
                    </ListGroup>
                </Jumbotron>
            )
            break
        case 2:     // error, failed to load
        return (
            <>
                <h6>Loading users list failed</h6>
                <hr/>
                <p>{error}</p>
            </>
        )
            break
    }
}

export default Users