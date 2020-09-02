import React, { useState, useEffect } from 'react'
import { Jumbotron, Card, Form, Spinner, Badge, Button, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faUserEdit, faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { accountEnabled } from '../../helpers/config'
import { useAuthenticate } from '../../../Controllers/context/authenticate'
import '../../../stylesheet/users.sass'

const Profile = (props) => {
    const [ loaded, setLoaded ] = useState(false)
    const [ accountState, setAccountState ] = useState({ color:"success", status: 'disable' })
    const [ user, setUser ] = useState(undefined)
    const { getUser, setUserSession } = useAuthenticate()

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
    const clickSubmit = () => { }
    const handleChange = name => event => { 
        setUser({...user, [name]: event.target.value}) }


    if (loaded && user) {
        return (
            <>
            <Jumbotron>
                <h4><FontAwesomeIcon icon={faUserEdit} /> {user.username} <Badge pill variant={user.role.color}>{user.role.name}</Badge></h4>
                <hr/>
            <Card id='editUser'>
                <Card.Body>
                    <Card.Title>
                        <Badge variant={accountState.color}> account {accountState.status}</Badge>
                    </Card.Title>
                    <Card.Subtitle className='mb-2 text-muted' />
                    <Card.Text>You can edit your profile there but you will have then to indicate your password and confirm it to apply.</Card.Text>
                    <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Your email</Form.Label>
                        <Form.Control type='email' placeholder={user.email} onChange={handleChange('email')} />
                        <Form.Text className='text-muted'>I will never share your email with anyone else.</Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicText">
                        <Form.Label>Your username</Form.Label>
                        <Form.Control type='text' placeholder={user.username} onChange={handleChange('username')} />
                        <Form.Text className="text-muted">he is unique there...</Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicFirstName">
                        <Form.Label>Your first name</Form.Label>
                        <Form.Control type='email' placeholder={user.first_name} onChange={handleChange('email')} />
                    </Form.Group>
                    <Form.Group controlId="formBasicSecondName">
                        <Form.Label>Your second name</Form.Label>
                        <Form.Control type='text' placeholder={user.second_name} onChange={handleChange('username')} />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Your password</Form.Label>
                        <Form.Control type='password' placeholder='password' onChange={handleChange('pass1')} />
                        <Form.Text className='text-muted'>total of 8 chars minimum, include: 1 or more number and special chars</Form.Text>
                    </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Confirm your password</Form.Label>
                            <Form.Control type='password' placeholder='password again' onChange={handleChange('pass2')} />
                            <Form.Text className='text-muted'>hit  again, you can not copy/paste</Form.Text>
                        </Form.Group>
                    </Form>
                    <Card.Link>
                        <Button type='submit' onClick={clickSubmit}><FontAwesomeIcon icon={faUserCheck} /></Button>
                    </Card.Link>
                </Card.Body>
            </Card>
            </Jumbotron>
        </>)
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
