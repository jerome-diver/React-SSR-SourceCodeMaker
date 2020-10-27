import React, { useState, useEffect, useReducer } from 'react'
import { Jumbotron, Card, Form, Badge, Tooltip,Modal,
         Button, Alert, OverlayTrigger } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserEdit, faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { accountEnabled } from '../../helpers/config'
import { useAuthenticate } from '../../../Controllers/context/authenticate'
import '../../../stylesheet/users.sass'
import { validatePassword, cypher, sendEmailLink } from '../../../Controllers/user/user-form-helper'
import { update } from '../../../Controllers/user/action-CRUD'
import { checkEmail } from '../../../Controllers/user/authenticate-api'
import parse from 'html-react-parser'
import { useTranslation } from 'react-i18next'
const navigatorInfo = require('navigator-info')
const _ = require('lodash')
import Loading from '../public/Loading.component'

const userReduce = (state, action) => {
    switch(action.type) {
        case 'session':
            return { ...state, session: action.value }
        case 'form':
            return { ...state, form: action.value }
        case 'origin':
            return { ...state, origin: action.value }
    }
}

const passwordReducer = (state, action) => {
    return { 
        first: action.first, 
        second: action.second,
        match: ((state.first === state.second) && state.first != '') }
}

const messageReducer = (state, action) => {
    return {
        text: (action.text) ? action.text : state.text,
        state: (action.text) ? true : false
    }
}

const washUser = (dirty_user) => {
    if(dirty_user) {
        delete dirty_user.created
        return dirty_user }
    return {}
}

const prepareCleanUser = (unprepared_user) => {
    const user = unprepared_user
    delete user.email
    if (user.password) { delete user.password }
    return user
}

const prepareCompareUser = (unprepared_user) => {
    const user = unprepared_user
    if (user.password) { delete user.password }
    return user
}

const prepareUpdatePasswordUser = (unprepared_user, new_password) => {
    const user = unprepared_user
    delete user.email
    user.password = new_password
    return user
}

const Profile = (props) => {
    console.log("--- Profile.component start function point")
    const { userProfile, userRole } = props
    const { t } = useTranslation()
    const { getUser, getRole, setSession } = useAuthenticate()

    const initMessage = { text: {}, state: false }

    const [ role, setRole ] = useState(getRole())
    const [ validated, setValidated ] = useState(false)
    const [ userForm, setUserForm ] = useState(washUser(userProfile))
    const [ userSession, setUserSession ] = useState(washUser(getUser()))
    const [ accountState, setAccountState ] = useState({ color:"success", status: 'disable' })
    const [ userNotChanged, setUserNotChanged ] = useState(true)
    const [ loaded, setLoaded ] = useState(false)
    const [ emailReadOnly, setEmailReadOnly ] = useState(true)
    const [ message, setMessage ] = useReducer(messageReducer, initMessage)
    const [ passwordToUpdate, setPasswordToUpdate ] = useState('')
    const [ showPasswordModal, setShowPasswordModal ] = useState(false)

    useEffect( () => {
        if (!userSession) setUserSession(washUser(getUser()))
        setAccountState(accountEnabled(userForm.validated)) 
        setLoaded(true)
    }, [userSession, message] )
  
    const info = navigatorInfo()
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
            if (userForm.password) {
                const [ haveError, validated ] = validatePassword(userForm.password)
                if (haveError) setMessage( {text: haveError} )
                else if (validated) {
                    if (userForm.email != userProfile.email) {  /*    M o d i f y   e m a i l 
                                                                    --> send email to:
                                                                        _ actual account email
                                                                        _ new account email to update 
                                                                    (with two links to accept or reject update) */
                        console.log("--- Profile component [clickSubmit -modify email-]")
                        const user_data = { username: userForm.username,
                                            old_email: userProfile.email,
                                            new_email: userForm.email }
                        sendEmailLink('updateEmail', user_data)
                    }
                    const password = cypher(userForm.password)
                    const parsedUser = (passwordToUpdate === '') 
                            ? prepareCleanUser(userForm) 
                            : prepareUpdatePasswordUser(userForm, passwordToUpdate)
                    update(parsedUser, password, userSession.id)
                        .then(response => {
                            if (response.error) setMessage( {text: response.error} )
                            else {
                                setUserSession(washUser(response.user))
                                setUserForm(washUser(response.user))
                                setSession(response)
                                setMessage( {text: {name: t('profile.modal.success.title'), 
                                                    message: t('profile.modal.success.text')}})
                            }
                            setLoaded(true)
                        } ) 
                }
            } else setMessage( {text: { name:t('sanitizer.frontend.password.missing.title'), 
                                        message: t('sanitizer.frontend.password.missing.text')} } )
        }
        setValidated(true)
    }
    const editUserRole = (e) => { console.log("Edit user Role") }
    const changeEmail = (e) => { 
        checkEmail(userForm.email).then(response => (response.status) ? editEmail() : emailNoEdit() )
    }
    const editEmail = () => { setEmailReadOnly(false) }
    const emailNoEdit = () => {
        const emailInput = document.getElementById("formEmail")
        emailInput.value = userProfile.email
        emailInput.style.color = 'grey'
        setUserForm(uf => { return {...uf, email: userProfile.email} })
        setEmailReadOnly(true)
    }
    const changePassword = (e) => { setShowPasswordModal(true) }
    const handleChange = (name, origin) => event => { 
        if ((name === 'email') && (!emailReadOnly)) {
            event.target.style.color = (event.target.value == origin.email) ? 'black' : 'red' }
        const value = event.target.value
        const result = { ...userForm, [name]: value }
        setUserForm( uf => { return {...uf, [name]: value} } )
        const compared = _.isEqual(origin, prepareCompareUser(result))
        if (name != 'password') setUserNotChanged(compared)
        console.log("--- Profile (handleChange) | %s for: userProfile => %s | EditField => %s | compared is %s", 
                    name, origin[name], result[name], compared)
    }
    const roleTooltip = (props) => (
        <Tooltip id="role-tooltip" {...props}>
            {(role.name === "Admin") ? t('profile.role.can_edit') : t('profile.role.admin_only')}
        </Tooltip>
    )
    const changeEmailTooltip = (props) => (
        <Tooltip id="email-tooltip" {...props}>
            {t('profile.email.button_tooltip')}
        </Tooltip>
    )
    const changePasswordTooltip = (props) => (
        <Tooltip id="email-tooltip" {...props}>
            {t('profile.password.button_tooltip')}
        </Tooltip>
    )

    if (loaded && userSession) {
        return (<>
            <Messenger message={message} setMessage={setMessage} />
            <PasswordUpdateModal show={showPasswordModal} setPasswordToUpdate={setPasswordToUpdate} />
            <Jumbotron>
                <h4>
                    <FontAwesomeIcon icon={faUserEdit} /> &nbsp;{t('profile.title', {username: userForm.username})}&nbsp;&nbsp; 
                    <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={roleTooltip}>
                        <Button disabled={((role.name !== "Admin") || (userSession.username == userProfile.username))}
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
                                {t('profile.header.title', { username: userForm.username })} <Badge variant={accountState.color}>{accountState.status}</Badge>
                                </Card.Title>
                            <Card.Subtitle className='mb-2 text-muted' />
                            <Card.Text>{t('profile.header.description')}</Card.Text>
                            <Form.Group controlId="formEmail">
                                <Form.Label>
                                    <OverlayTrigger placement="right" 
                                                    delay={{ show: 250, hide: 400 }} 
                                                    overlay={changeEmailTooltip}>
                                        <Button size='sm' variant='outline-light' onClick={changeEmail}>
                                            {t('profile.email.button')}
                                            </Button>
                                    </OverlayTrigger>
                                </Form.Label>
                                <Form.Control type='email' 
                                              readOnly={emailReadOnly} 
                                              defaultValue={userForm.email} 
                                              onChange={handleChange('email', userProfile)} />
                                <Form.Control.Feedback type="invalid">
                                    {t('profile.email.correct_error')}
                                    </Form.Control.Feedback>
                                <Form.Text className='text-muted'>{t('profile.email.helper')}</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formText">
                                <Form.Label>{t('profile.username.label')}</Form.Label>
                                <Form.Control type='text' 
                                              defaultValue={userForm.username} 
                                              onChange={handleChange('username', userProfile)} />
                                <Form.Control.Feedback type="invalid">
                                    {t('profile.username.correct_error')}
                                    </Form.Control.Feedback>
                                <Form.Text className="text-muted">{t('profile.username.helper')}</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formFirstName">
                                <Form.Label>{t('profile.first_name.label')}</Form.Label>
                                <Form.Control type='text'
                                              defaultValue={userForm.first_name} 
                                              onChange={handleChange('first_name', userProfile)} />
                                <Form.Control.Feedback type="invalid">
                                    {t('profile.first_name.correct_error')}
                                    </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formSecondName">
                                <Form.Label>{t('profile.second_name.label')}</Form.Label>
                                <Form.Control type='text' 
                                              defaultValue={userForm.second_name} 
                                              onChange={handleChange('second_name', userProfile)} />
                                <Form.Control.Feedback type="invalid">
                                    {t('profile.second_name.correct_error')}
                                    </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Label>
                                    <OverlayTrigger placement="right" 
                                                    delay={{ show: 250, hide: 400 }} 
                                                    overlay={changePasswordTooltip}>
                                        <Button size='sm' variant='outline-light' onClick={changePassword}>
                                            {t('profile.password.button')}
                                            </Button>
                                    </OverlayTrigger>
                                </Form.Label>
                                <Form.Control type='password' 
                                              placeholder={t('profile.password.placeholder')} 
                                              onChange={handleChange('password', userProfile)} />
                                <Form.Text className='text-muted'>{t('profile.password.helper')}</Form.Text>
                            </Form.Group>
                            <Card.Title>{t('profile.origin.title')}</Card.Title>
                            <Card.Text>{t('profile.origin.device')} {info.device} {info.os} ({info.language})</Card.Text>
                            <Card.Text>{t('profile.origin.browser')} {info.browser} {info.version} ({info.engine})</Card.Text>
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
            <Loading />
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

const PasswordUpdateModal = (props) => {
    const { showModal, setPasswordToUpdate } = props
    const { t } = useTranslation()
    const [ password, setPassword ] = useReducer(passwordReducer, { first: '', second: '' }) 
    const [ show, setShow ] = useState(showModal)

    const closeModal = () => { setShow(false) }
    const updatePasswordSubmit = () => {
        if (password.match) { 
            setPasswordToUpdate(password.first)
            closeModal() }
    }
    const handleChange = name => event => { 
        setPassword( {...password, [name]: event.target.value } )
    }

    return <>
        <Modal show={show}>
            <Modal.Header closeButton>
                <Modal.Title>{t('profile.modal.update.password.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formPassword">
                        <Form.Label>{t('profile.modal.update.password.first.label')}</Form.Label>
                        <Form.Control type='password' placeholder={t('profile.modal.update.password.first.placeholder')}
                                      onChange={handleChange('first')} />
                        <Form.Text className='text-muted'>{t('profile.modal.update.password.first.helper')}</Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label>{t('profile.modal.update.password.second.label')}</Form.Label>
                        <Form.Control type='password' placeholder={t('profile.modal.update.password.second.placeholder')}
                                      onChange={handleChange('second')} />
                        <Form.Text className='text-muted'>{t('profile.modal.update.password.second.helper')}</Form.Text>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={updatePasswordSubmit}>{t('profile.modal.update.password.button.submit')}</Button>
                <Button onClick={closeModal}>{t('profile.modal.update.password.button.cancel')}</Button>
            </Modal.Footer>
        </Modal>
    </>
}


export default Profile
