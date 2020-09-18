import React, { useState, useEffect, useReducer } from 'react'
import { Jumbotron, Card, Form, Spinner, Badge, Tooltip,Modal,
         Button, Alert, OverlayTrigger } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faUserEdit, faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { accountEnabled } from '../../helpers/config'
import { useAuthenticate } from '../../../Controllers/context/authenticate'
import '../../../stylesheet/users.sass'
import { canChangeEmail, validatePassword, cypher } from '../../../Controllers/user/user-form-helper'
import { update } from '../../../Controllers/user/action-CRUD'
import parse from 'html-react-parser'

const userReducer = (state, action) => {
    return { 
        session: (action.session) ? action.session : state.session, 
        form: (action.form) ? action.form : state.form ,
        origin: (action.origin) ? action.origin : state.origin }
}

const messageReducer = (state, action) => {
    return {
        message: (action.message) ? action.message : state.message,
        state: (action.message) ? true : false
    }
}

const washUser = (dirty_user) => {
    if(dirty_user) {
        delete dirty_user.created_at
        return dirty_user }
    return {}
}

const prepareCleanUser = (clean_user) => {
    const user = clean_user
    if (user.password) { delete user.password }
    return user
}

const Profile = (props) => {
    console.log("--- Profile.component start function point")
    const { userProfile, userRole } = props
    const { getUser, getRole, setSession } = useAuthenticate()
    const [ role, setRole ] = useState(getRole())
    const [ validated, setValidated ] = useState(false)
    const [ user, setUser ] = useReducer(userReducer, { session: washUser(getUser()), 
                                                        form: washUser(userProfile), 
                                                        origin: washUser(userProfile)})
    const [ accountState, setAccountState ] = useState({ color:"success", status: 'disable' })
    const [ userNotChanged, setUserNotChanged ] = useState(true)
    const [ loaded, setLoaded ] = useState(false)
    const [ emailReadOnly, setEmailReadOnly ] = useState(false)
    const [ message, setMessage ] = useReducer(messageReducer, { message: {}, state: false })

    useEffect( () => {
        console.log("--- Profile.component useEffect")
        const clean_user = washUser(getUser())
        if (!user.session) setUser({session: clean_user})
        setAccountState(accountEnabled(user.form.validated)) 
        setLoaded(true)
    }, [user] )
  
    const clickSubmit = (e) => { // should update user if form entries are conform
        setLoaded(false)
        const form_to_submit = e.currentTarget;
        if (form_to_submit.checkValidity() === false) {
            console.log("I'm in form_submit condition space")
            e.preventDefault();
            e.stopPropagation();
        } else {
            e.preventDefault()
            console.log("Submit clicked", message, user)
            if (user.form.password) {
                const [ haveError, validated ] = validatePassword(user.form.password)
                if (haveError) setMessage( {message: haveError} )
                else if (validated) {
                    const password = cypher(user.form.password)
                    const parsedUser = prepareCleanUser(user.form)
                    update(parsedUser, password, user.session.id)
                        .then(response => {
                            setLoaded(true)
                            if (response.error) setMessage( {message: response.error} )
                            else {
                                setMessage( {message: {name: 'Updated user', message: "User update success."}})
                                setUser({session: washUser(response.user), form: washUser(response.user)})
                                setSession(response)
                                 }
                } ) }
            } else setMessage( {message: {name:'missing field', message: 'You have to inform a password to update something'} } )
        }
        setValidated(true)
    }
    const editUserRole = (e) => { console.log("Edit user Role") }
    const changeEmail = (e) => { canChangeEmail(editEmail, emailNoEdit) }
    const editEmail = () => {
        setEmailReadOnly(false)
    }
    const emailNoEdit = () => {
        const emailInput = document.getElementById("formEmail")
        emailInput.value = user.origin.email
        emailInput.style.color = 'grey'
        setUser({form: {...user.form, email: user.origin.email}})
        setEmailReadOnly(true)
    }
    const changePassword = (e) => { 
        console.log("Change password")
     }
    const compare = () => {  // check differences between actual entries and existing user data
        const user_formated = prepareCleanUser(user.form)
        return (user.session === user_formated)
    }
    const handleChange = name => event => { 
        setUserNotChanged(compare())
        if ((name === 'email') & (!emailReadOnly)) event.target.style.color = (event.target.value == user.session.email) ? 'black' : 'red'
        setUser( { form: {...user.form, [name]: event.target.value} } )
    }
    const roleTooltip = (props) => (
        <Tooltip id="role-tooltip" {...props}>
            {(role.name === "Admin") ? 'Change role' : 'Only admin can modify role'}
        </Tooltip>
    )
    const changeEmailTooltip = (props) => (
        <Tooltip id="email-tooltip" {...props}>
            I will send an email with a link to this address and you will have 2 days to validate your choice by click on the link.
        </Tooltip>
    )
    const changePasswordTooltip = (props) => (
        <Tooltip id="email-tooltip" {...props}>
            Change your password
        </Tooltip>
    )

    if (loaded && user.session) {
        return (
            <>
            <Messenger message={message} setMessage={setMessage} />
            <Jumbotron>
                <h4>
                    <FontAwesomeIcon icon={faUserEdit} /> &nbsp;{user.username}&nbsp;&nbsp; 
                    <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={roleTooltip}>
                        <Button disabled={((role.name !== "Admin") || (user.session.username == userProfile.username))}
                                onClick={editUserRole} 
                                size='sm' variant={`outline-${userRole.color}`}>
                            {userRole.name}
                        </Button>
                    </OverlayTrigger>
                </h4>
                <hr/>
                <Card id='editUser'>
                    <Card.Body>
                        <Form onSubmit={clickSubmit} noValidate validated={validated}>
                            <Card.Title>
                                <Badge variant={accountState.color}> account {accountState.status}</Badge>
                            </Card.Title>
                            <Card.Subtitle className='mb-2 text-muted' />
                            <Card.Text>You can edit your profile there but you will have then to indicate your password and confirm it to apply.</Card.Text>
                            <Form.Group controlId="formEmail">
                                <Form.Label>
                                    <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={changeEmailTooltip}>
                                        <Button size='sm' variant='outline-light' onClick={changeEmail}>Email</Button>
                                    </OverlayTrigger>
                                </Form.Label>
                                <Form.Control type='email' readOnly={emailReadOnly} defaultValue={user.form.email} onChange={handleChange('email')} />
                                <Form.Control.Feedback type="invalid">Please choose a valid email.</Form.Control.Feedback>
                                <Form.Text className='text-muted'>Click the button to modify your email, it will be modified only if you confirm from your email box.</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formText">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type='text' defaultValue={user.form.username} onChange={handleChange('username')} />
                                <Form.Control.Feedback type="invalid">Please choose a valid username.</Form.Control.Feedback>
                                <Form.Text className="text-muted">he is unique there...</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formFirstName">
                                <Form.Label>First name</Form.Label>
                                <Form.Control type='text' defaultValue={user.form.first_name} onChange={handleChange('first_name')} />
                                <Form.Control.Feedback type="invalid">Please choose a valid family name.</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formSecondName">
                                <Form.Label>Second name</Form.Label>
                                <Form.Control type='text' defaultValue={user.form.second_name} onChange={handleChange('second_name')} />
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Label>
                                    <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={changePasswordTooltip}>
                                        <Button size='sm' variant='outline-light' onClick={changePassword}>Password</Button>
                                    </OverlayTrigger>
                                </Form.Label>
                                <Form.Control type='password' placeholder='password' onChange={handleChange('password')} />
                                <Form.Control.Feedback type="invalid">Please choose a valid second name.</Form.Control.Feedback>
                                <Form.Text className='text-muted'>total of 8 chars minimum, include: 1 or more number and special chars</Form.Text>
                            </Form.Group>
                            <Card.Link>
                                <Button type='submit' variant="warning" disabled={userNotChanged}>
                                    <FontAwesomeIcon icon={faUserCheck} /> Apply
                                </Button>
                            </Card.Link>
                        </Form>
                    </Card.Body>
                </Card>
            </Jumbotron>
        </>)
    } else {
        return (<>
            <Messenger message={message} setMessage={setMessage} />
            <Alert variant='info'>
                <Spinner animation='border' role='status'/>
                <p>Loading...</p>
            </Alert>
        </>)
    }
}

const Messenger = (props) => {
    const { message, setMessage } = props

    const closeModal = () => { setMessage({}) }

    return (<>
            <Modal show={message.state}>
                <Modal.Header closeButton>
                    <Modal.Title>Failed to login with {message.message.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant='error'>{parse(`${message.message.message}`)}</Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={closeModal}>OK</Button>
                </Modal.Footer>
            </Modal>
    </>)
}


export default Profile
