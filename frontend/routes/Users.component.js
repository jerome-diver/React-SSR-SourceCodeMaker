import React, { useState, useEffect } from 'react'
import { list } from '../user/action-api'
import { Jumbotron, ListGroup, Spinner } from 'react-bootstrap'
import '../stylesheet/users.sass'

const User = (props) => {
    return (
        <ListGroup.Item id={props.data.id}>
          {props.data.username}
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