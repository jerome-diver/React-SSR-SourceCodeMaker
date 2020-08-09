import React, { useState, useEffect } from 'react'
import { list } from '../user/action-api'
import { Jumbotron, ListGroup } from 'react-bootstrap'

const User = (props) => {
    return (
        <ListGroup.Item>
          {props.name}
        </ListGroup.Item>
    )
}

const Users = () => {
    const [users, setUsers] = useState([])
  
    useEffect( () => {
        const abort = new AbortController()
        const signal = abort.signal
        list(signal).then( (data) => {
            if (data && data.error) { console.log(data.error) } else { setUsers(data) } } )
        return function cleanup() { abort.abort() }
    }, [] )
  
    return (
        <Jumbotron fluid>
            <h1>Users list</h1>    
            <ListGroup>
                users.map((user, index) => {
                    <User name={user.name} />
                })
            </ListGroup>
        </Jumbotron>
    )
}

export default Users;