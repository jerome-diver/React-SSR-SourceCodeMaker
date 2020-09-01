import React, { useState, useEffect } from 'react'
import { Jumbotron, Spinner, Badge, Button, Alert } from 'react-bootstrap'
import { accountEnabled } from '../../helpers/config'
import { useAuthentify } from '../../../Controllers/context/authenticate'
import '../../../stylesheet/users.sass'

const Profile = (props) => {
    const [ loaded, setLoaded ] = useState(false)
    const [ accountState, setAccountState ] = useState({ color:"success", status: 'disable' })
    const [ user, setUser ] = useState(undefined)
    const { getUser, setUserSession } = useAuthentify()

    useEffect( () => {
        console.log("Effect from Profile")
        const u = getUser()
        setUser(u)
        setAccountState(accountEnabled(u.validated))
        setLoaded(true)
    }, [] )
  
    const editProfile = (e) => {
        e.preventDefault()
        console.log("EDIT PROFILE FOR: ", user.username)
    } 

    if (loaded && user) {
        return (
            <Jumbotron>
                <h4>{user.username} <Badge pill variant={user.role.color}>{user.role.name}</Badge></h4>
                <hr/>
                <p>Account: <Badge variant={accountState.color}>{accountState.status}</Badge></p>
                <p>Email: {user.email}</p> 
                <p>First name: {user.first_name}</p>
                <p>Second name: {user.second_name}</p>
                <Button className='btn btn-sm btn-primary' 
                        onClick={ editProfile }>Edit profile
                </Button>
            </Jumbotron>
        )
    } else {
        return (
            <>
                <Alert variant='info'>
                    <Spinner animation='border' role='status'/>
                    <p>Loading...</p>
                </Alert>
            </>
        )
    }
}

export default Profile
