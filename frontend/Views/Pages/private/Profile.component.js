import React, { useState, useEffect } from 'react'
import { Jumbotron, Card, Form, Spinner, Badge, Tooltip,
         Button, Alert, OverlayTrigger } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faUserEdit, faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { accountEnabled } from '../../helpers/config'
import { useAuthenticate } from '../../../Controllers/context/authenticate'
import '../../../stylesheet/users.sass'

const Profile = (props) => {
    const { getUser, setUserSession } = useAuthenticate()
    const [ loaded, setLoaded ] = useState(false)
    const [ accountState, setAccountState ] = useState({ color:"success", status: 'disable' })
    const [ user, setUser ] = useState(getUser())
    const [ userNotChanged, setUserNotChanged ] = useState(true)

    useEffect( () => {
        console.log("Effect from Profile")
        const u = getUser()
        setUser(u)
        setAccountState(accountEnabled(u.validated))
        setLoaded(true)
    }, [] )
  
    const clickSubmit = (e) => {
        e.preventDefault()
        // check entries validation (parser)
        // if ok, update user
        // else open dialog to show error entries or forbid things
     }
    const editUserRole = () => { }
    const compare = () => {
        // check differences between actual entries and existing user data
        // and content of passwords (validate or not)
        return false 
    }
    const handleChange = name => event => { 
        setUserNotChanged(compare())
        setUser({...user, [name]: event.target.value}) }
    const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        {(user.role.name === "Admin") ? 'Change role' : 'Only admin can modify role'}
    </Tooltip>
    )

    if (loaded && user) {
        return (
            <>
            <Jumbotron>
                <h4>
                    <FontAwesomeIcon icon={faUserEdit} /> &nbsp;{user.username}&nbsp;&nbsp; 
                    <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
                        <Button disabled={(user.role.name !== "Admin")}
                                onClick={editUserRole} 
                                size='sm' variant={`outline-${user.role.color}`}>
                            {user.role.name}
                        </Button>
                    </OverlayTrigger>
                </h4>
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
                        <Form.Text className='text-muted'>If your email is modified, i will disable this account and send a 2 days valid confirmation email link for you to apply.</Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicText">
                        <Form.Label>Your username</Form.Label>
                        <Form.Control type='text' placeholder={user.username} onChange={handleChange('username')} />
                        <Form.Text className="text-muted">he is unique there...</Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicFirstName">
                        <Form.Label>Your first name</Form.Label>
                        <Form.Control type='email' placeholder={user.first_name} onChange={handleChange('first_name')} />
                    </Form.Group>
                    <Form.Group controlId="formBasicSecondName">
                        <Form.Label>Your second name</Form.Label>
                        <Form.Control type='text' placeholder={user.second_name} onChange={handleChange('second_name')} />
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
                        <Button type='submit' onClick={clickSubmit} 
                                variant="warning"
                                disabled={userNotChanged}>
                            <FontAwesomeIcon icon={faUserCheck} /> Apply
                        </Button>
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
