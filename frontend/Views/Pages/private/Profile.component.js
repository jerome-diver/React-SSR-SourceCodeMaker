import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { read } from '../../../Controllers/user/action-api'
import { Jumbotron, Spinner, Badge, Button, Alert } from 'react-bootstrap'
import { variant, accountEnabled } from '../../helpers/config'
import '../../../stylesheet/users.sass'

const Profile = (props) => {

    const [user, setUser] = useState({role: 'Reader', username: 'no one', 
                                     first_name: '', second_name: '', 
                                     email: '', validated: ''})
    const [load, setLoad] = useState(false)
    const [accountState, setAccountState] = useState({ color:"success", status: 'disable' })
    const { username } = useParams()
    const credentials = ''
    const promote = variant(user.role)

    useEffect( () => {
        console.log("Effect from Profile")
        const abort = new AbortController()
        const signal = abort.signal
        read(username, signal)
            .then( (data) => {
                if (!data) { console.log('No data received')}
                else if (data.error) { console.log(data.error) } 
                else { 
                    setUser(data.user) 
                    const accountStatus = accountEnabled(data.user.validated)
                    setAccountState(accountStatus) } } )
            .catch((error) => console.log("ERROR", error))
        setLoad(true)
        return function cleanup() { abort.abort() }
    }, [] )
  
    const editProfile = username => (e) => {
        e.preventDefault()
        console.log("EDIT PROFILE FOR: ", username)
    } 

    if (load) {
        return (
            <Jumbotron>
                <h4>{user.username} <Badge pill variant={promote}>{user.role}</Badge></h4>
                <hr/>
                <p>Account: <Badge variant={accountState.color}>{accountState.status}</Badge></p>
                <p>Email: {user.email}</p> 
                <p>First name: {user.first_name}</p>
                <p>Second name: {user.second_name}</p>
                <Button className='btn btn-sm btn-primary' 
                        onClick={ editProfile(username) }>Edit profile
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
