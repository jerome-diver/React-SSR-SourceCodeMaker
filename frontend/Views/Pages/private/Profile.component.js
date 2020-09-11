import React, { useState, useEffect, useReducer } from 'react'
import { Jumbotron, Card, Form, Spinner, Badge, Tooltip,Modal,
         Button, Alert, OverlayTrigger } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faUserEdit, faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { accountEnabled } from '../../helpers/config'
import { useAuthenticate } from '../../../Controllers/context/authenticate'
import '../../../stylesheet/users.sass'
import { validatePassword } from '../../../Controllers/user/user-form-helper'
import { update } from '../../../Controllers/user/action-CRUD'
import { cypher } from '../../../Controllers/user/user-form-helper'

const userReducer = (state, action) => {
    return { 
        session: (action.session) ? action.session : state.session, 
        form: (action.form) ? action.form : state.form }
}

const errorReducer = (state, action) => {
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
    const { getUser, getRole, setSession } = useAuthenticate()
    console.log("--- Profile.component start function point", getRole())
    const clean_user = washUser(getUser())
    const [ role, setRole ] = useState(getRole())
    const [ user, setUser ] = useReducer(userReducer, { session: clean_user, form: clean_user})
    const [ accountState, setAccountState ] = useState({ color:"success", status: 'disable' })
    const [ userNotChanged, setUserNotChanged ] = useState(true)
    const [ loaded, setLoaded ] = useState(false)
    const [ error, setError ] = useReducer(errorReducer, { message: {}, state: false })

    useEffect( () => {
        console.log("--- Profile.component useEffect:", error, user)
        if (!user.session) setUser({session: clean_user})
        setAccountState(accountEnabled(clean_user.validated)) 
        setLoaded(true)
    }, [user, error] )
  
    const closeModal = () => { setError({}) }
    const clickSubmit = (e) => { // should update user if form entries are conform
        e.preventDefault()
        console.log("Submit clicked", error, user)
        if (user.form.password) {
            const [ haveError, validated ] = validatePassword(user.form.password)
            if (haveError) setError( {message: haveError} )
            else if (validated) {
                const password = cypher(user.form.password)
                const parsedUser = prepareCleanUser(user.form)
                update(parsedUser, password, user.session.id)
                    .then(response => {
                        if (response.error) setError( {message: response.error} )
                        else {
                            setSession(response)
                            setUser({session: washUser(response.user), form: washUser(response.user)}) }
            } ) }
        } else setError( {message: {name:'missing field', message: 'You have to inform a password to update something'} } )
    }
    const editUserRole = () => { }
    const compare = () => {  // check differences between actual entries and existing user data
        const user_formated = prepareCleanUser(user.form)
        return (user.session === user_formated)
    }
    const handleChange = name => event => { 
        setUserNotChanged(compare())
        setUser( { form: {...user.form, [name]: event.target.value} } ) }
    const roleTooltip = (props) => (
        <Tooltip id="role-tooltip" {...props}>
            {(role.name === "Admin") ? 'Change role' : 'Only admin can modify role'}
        </Tooltip>
    )
    const changeEmailTooltip = (props) => (
        <Tooltip id="email-tooltip" {...props}>
            If your email is modified, i will disable this account and send a 2 days valid confirmation email link for you to apply.
        </Tooltip>
    )

    if (loaded && user.session) {
        return (
            <>
            <Modal show={error.state}>
                <Modal.Header closeButton>
                    <Modal.Title>Failed to login with {error.message.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant='error'>{error.message.message}</Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={closeModal}>OK</Button>
                </Modal.Footer>
            </Modal>
            <Jumbotron>
                <h4>
                    <FontAwesomeIcon icon={faUserEdit} /> &nbsp;{user.username}&nbsp;&nbsp; 
                    <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={roleTooltip}>
                        <Button disabled={(role.name !== "Admin")}
                                onClick={editUserRole} 
                                size='sm' variant={`outline-${role.color}`}>
                            {role.name}
                        </Button>
                    </OverlayTrigger>
                </h4>
                <hr/>
                <Card id='editUser'>
                    <Card.Body>
                        <Form onSubmit={clickSubmit}>
                            <Card.Title>
                                <Badge variant={accountState.color}> account {accountState.status}</Badge>
                            </Card.Title>
                            <Card.Subtitle className='mb-2 text-muted' />
                            <Card.Text>You can edit your profile there but you will have then to indicate your password and confirm it to apply.</Card.Text>
                            <Form.Group controlId="formEmail">
                                <Form.Label>
                                    <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={changeEmailTooltip}>
                                        <Button size='sm' variant='outline-light' >Your email</Button>
                                    </OverlayTrigger>
                                </Form.Label>
                                <Form.Control type='email' readOnly={true} defaultValue={user.session.email} onChange={handleChange('email')} />
                                <Form.Text className='text-muted'>If your email is modified, i will disable this account and send a 2 days valid confirmation email link for you to apply.</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formText">
                                <Form.Label>Your username</Form.Label>
                                <Form.Control type='text' defaultValue={user.session.username} onChange={handleChange('username')} />
                                <Form.Text className="text-muted">he is unique there...</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formFirstName">
                                <Form.Label>Your first name</Form.Label>
                                <Form.Control type='text' defaultValue={user.session.first_name} onChange={handleChange('first_name')} />
                            </Form.Group>
                            <Form.Group controlId="formSecondName">
                                <Form.Label>Your second name</Form.Label>
                                <Form.Control type='text' defaultValue={user.session.second_name} onChange={handleChange('second_name')} />
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Label>Your password</Form.Label>
                                <Form.Control type='password' placeholder='password' onChange={handleChange('password')} />
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
