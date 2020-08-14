import React, { useState, useEffect } from 'react'
import { read } from '../../../Controllers/user/action-api'
import { Jumbotron, Spinner, Badge, Button } from 'react-bootstrap'
import '../../../stylesheet/users.sass'

const Profile = (props) => {
    const [user, setUser] = useState({})
    const [load, setLoad] = useState(false)

    useEffect( () => {
        const abort = new AbortController()
        const signal = abort.signal
        const username = ''
        const credentials = ''
        read(username, credentials, signal).then( (data) => {
            if (data && data.error) { console.log(data.error) } 
            else { setUser(data.user) } } )
        setLoad(true)
        return function cleanup() { abort.abort() }
    }, [] )
  

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

    const editProfile = (username) => {
        console.log("EDIT PROFILE FOR: ", username)
    } 

    if (load) {
        return (
            <Jumbotron>
                <h4>{user.username} <Badge pill variant={variant(user.role)}>{user.role}</Badge></h4>
                <hr/>
                <p>Email: {user.email}</p> 
                <p>First name: {user.first_name}</p>
                <p>Second name: {user.second_name}</p>
                <Button className='btn btn-sm btn-primary' 
                        onClick={() => { editProfile(user.username) } }>Edit profile</Button>
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

export default Profile
