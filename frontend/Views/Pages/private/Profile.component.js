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
import { useTranslation } from 'react-i18next'

const userReducer = (state, action) => {
    return { 
        session: (action.session) ? action.session : state.session, 
        form: (action.form) ? action.form : state.form ,
        origin: (action.origin) ? action.origin : state.origin }
}

const messageReducer = (state, action) => {
    return {
        text: (action.message) ? action.message : state.message,
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
    const { t } = useTranslation()
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
                if (haveError) setMessage( {text: haveError} )
                else if (validated) {
                    const password = cypher(user.form.password)
                    const parsedUser = prepareCleanUser(user.form)
                    update(parsedUser, password, user.session.id)
                        .then(response => {
                            setLoaded(true)
                            if (response.error) setMessage( {text: response.error} )
                            else {
                                setUser({session: washUser(response.user), form: washUser(response.user)})
                                setSession(response)
                                setMessage( {text: {name: t('profile.modal.title_success'), 
                                                    message: t('profile.modal.text_success')}})
                            }
                } ) }
            } else setMessage( {text: {name:'missing field', message: 'You have to inform a password to update something'} } )
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
            {(role.name === "Admin") ? t('profile.role_can_edit') : t('profile.role_admin_only')}
        </Tooltip>
    )
    const changeEmailTooltip = (props) => (
        <Tooltip id="email-tooltip" {...props}>
            {t('profile.email_button_tooltip')}
        </Tooltip>
    )
    const changePasswordTooltip = (props) => (
        <Tooltip id="email-tooltip" {...props}>
            {t('profile.password_button_tooltip')}
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
                                <Badge variant={accountState.color}>{accountState.status}</Badge>
                            </Card.Title>
                            <Card.Subtitle className='mb-2 text-muted' />
                            <Card.Text>{t('profile.edit_profile_text')}</Card.Text>
                            <Form.Group controlId="formEmail">
                                <Form.Label>
                                    <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={changeEmailTooltip}>
                                        <Button size='sm' variant='outline-light' onClick={changeEmail}>{t('profile.email_button')}</Button>
                                    </OverlayTrigger>
                                </Form.Label>
                                <Form.Control type='email' readOnly={emailReadOnly} defaultValue={user.form.email} onChange={handleChange('email')} />
                                <Form.Control.Feedback type="invalid">{t('profile.email_correct_error')}</Form.Control.Feedback>
                                <Form.Text className='text-muted'>{t('profile.email_helper')} Click the button to modify your email, it will be modified only if you confirm from your email box.</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formText">
                                <Form.Label>{t('profile.username_label')}</Form.Label>
                                <Form.Control type='text' defaultValue={user.form.username} onChange={handleChange('username')} />
                                <Form.Control.Feedback type="invalid">{t('profile.username_correct_error')}</Form.Control.Feedback>
                                <Form.Text className="text-muted">{t('profile.username_helper')}</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formFirstName">
                                <Form.Label>{t('profile.first_name_label')}</Form.Label>
                                <Form.Control type='text' defaultValue={user.form.first_name} onChange={handleChange('first_name')} />
                                <Form.Control.Feedback type="invalid">{t('profile.first_name_correct_error')}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formSecondName">
                                <Form.Label>{t('profile.second_name_label')}</Form.Label>
                                <Form.Control type='text' defaultValue={user.form.second_name} onChange={handleChange('second_name')} />
                                <Form.Control.Feedback type="invalid">{t('profile.second_name_correct_error')}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Label>
                                    <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={changePasswordTooltip}>
                                        <Button size='sm' variant='outline-light' onClick={changePassword}>{t('profile.password_button')}</Button>
                                    </OverlayTrigger>
                                </Form.Label>
                                <Form.Control type='password' placeholder={t('profile.password_placeholder')} onChange={handleChange('password')} />
                                <Form.Text className='text-muted'>{t('profile.password_helper')}</Form.Text>
                            </Form.Group>
                            <Card.Link>
                                <Button type='submit' variant="warning" disabled={userNotChanged}>
                                    <FontAwesomeIcon icon={faUserCheck} /> {t('profile.submit')}
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
                <p>{t('general.loading')}</p>
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
                    <Modal.Title>{message.text.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant='error'>{parse(`${message.text.message}`)}</Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={closeModal}>OK</Button>
                </Modal.Footer>
            </Modal>
    </>)
}


export default Profile
