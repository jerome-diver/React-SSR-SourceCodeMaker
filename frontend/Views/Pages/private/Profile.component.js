import React, { useState, useEffect, useReducer } from 'react'
import { Card, Form, Badge, Tooltip, Modal,
         Button, Alert, OverlayTrigger } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserEdit, faUserCheck, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { accountEnabled } from '../../helpers/config'
import { useAuthenticate } from '../../../Controllers/context/authenticate'
import '../../../stylesheet/users.sass'
import { validatePassword, cypher, sendEmailLink, fireError } from '../../../Controllers/user/user-form-helper'
import { update, updatePassword } from '../../../Controllers/user/action-CRUD'
import { checkEmail } from '../../../Controllers/user/authenticate-api'
import parse from 'html-react-parser'
import { useTranslation } from 'react-i18next'
import { getGravatarUrl } from 'react-awesome-gravatar';
const navigatorInfo = require('navigator-info')
const _ = require('lodash')
import { Loading } from '../public/Printers.component'

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
    const { getUser, getRole, getStatus, setStatus, setSession } = useAuthenticate()

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
    const [ toggleEmail, setToggleEmail ] = useState('outline-light')
    const [ togglePwd, setTogglePwd ] = useState('outline-light')
    const [ avatar, setAvatar ] = useState(<FontAwesomeIcon icon={faUserCircle} style={{margin: '4px'}}/>)

    useEffect( () => {
        if (!userSession) setUserSession(washUser(getUser()))
        setAccountState(accountEnabled(userForm.validated)) 
        const options = {size: 18, default: 'mp'}
        const gravatar = getGravatarUrl(userSession.email, options)
        setAvatar(<img src={gravatar} className='mr-2'/>)
        setLoaded(true)
    }, [userSession, message] )
  
    const info = navigatorInfo()
    const clickSubmit = (e) => { // should update user if form entries are conform
        setLoaded(false)
        const form_to_submit = e.currentTarget;
        if (form_to_submit.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            e.preventDefault()
            console.log("Submit clicked for user: %s, and message: %s", userForm.username, message)
            if (userForm.password) {
                const [ haveError, validated ] = validatePassword(userForm.password)
                if (haveError) setMessage( {text: haveError} )
                else if (validated) {
                    let name = t('profile.modal.update.title')
                    let message = ''
                    if (userForm.email != userProfile.email) {  /*    M o d i f y   e m a i l 
                                                                    --> send email to:
                                                                        _ actual account email
                                                                        _ new account email to update 
                                                                    (with two links to accept or reject update) */
                        console.log("--- Profile component [clickSubmit -modify email-]")
                        // Verify email is existing and apply to send email links to accept to modify (or not) 
                        checkEmail(userForm.email).then(response => {
                            if (response.status) {
                                const user_data = { username: userForm.username,
                                                    old_email: userProfile.email,
                                                    new_email: userForm.email }
                                const sentEmail = sendEmailLink('updateEmail', user_data)
                                if (sentEmail.oldEmail.sent && sentEmail.newEmail.sent) { 
                                    setStatus({email: sentEmail.newEmail.email}) }
                            } else { message += response.error + '\n' }
                        }) 
                    }
                    const password = cypher(userForm.password)
                    /* Need to first check password to prepare user with/without password to update */
                    const parsedUser = (updatePwd()) 
                            ? prepareUpdatePasswordUser(userForm, passwordToUpdate) 
                            : prepareCleanUser(userForm) 
                    
                    
                    update(parsedUser)
                        .then(response => {
                            setUserSession(washUser(response.user))
                            setUserForm(washUser(response.user))
                            setSession(response)
                            message += t('profile.modal.success.text') + "\n"
                        })
                        .catch(error => setMessage({text: error}) )
                        .finally(() => setLoaded(true))
                    setMessage( {text: { name, message }})
                }
            } else setMessage( {text: { name: t('sanitizer.frontend.password.missing.title'), 
                                        message: t('sanitizer.frontend.password.missing.text')} } )
        }
        setValidated(true)
    }
    const editUserRole = (e) => { console.log("Edit user Role") }
    const changeEmail = (e) => { (emailReadOnly) ? editEmail() : emailNoEdit() }
    const editEmail = () => { 
        setEmailReadOnly(false) 
        setToggleEmail("outline-warning")
    }
    const emailNoEdit = () => {
        const emailInput = document.getElementById("formEmail")
        emailInput.value = userProfile.email
        emailInput.style.color = 'grey'
        setUserForm(uf => { return {...uf, email: userProfile.email} })
        setEmailReadOnly(true)
        setToggleEmail('outline-light')
    }
    const updatePwd = () => { return (passwordToUpdate.length !== 0) }
    const changePassword = (e) => { 
        console.log("password to update is", passwordToUpdate, updatePwd())
        if (updatePwd()) {
            setPasswordToUpdate('')
            setTogglePwd('outline-light')
         } else {
            setShowPasswordModal(true)
            setTogglePwd('outline-warning')
         }
    }
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
    const changeEmailTooltip = (props) => {
        const text = (emailReadOnly) ? t('profile.email.button.tooltip.on') : t('profile.email.button.tooltip.off')
        return ( <Tooltip id="email-tooltip" {...props}>{text}</Tooltip> )
    }

    const changePasswordTooltip = (props) => {
        const text = (passwordToUpdate.length === 0) 
                ? t('profile.password.button.tooltip.on') 
                : t('profile.password.button.tooltip.off')
        return ( <Tooltip id="email-tooltip" {...props}>{text}</Tooltip> )
    }

    if (loaded && userSession) {
        return <>
            <Messenger message={message} setMessage={setMessage} />
            <PasswordUpdateModal showModal={showPasswordModal} 
                                 setShowModal={setShowPasswordModal} 
                                 setPasswordToUpdate={setPasswordToUpdate}
                                 setVariant={setTogglePwd} />
            
            <div class="bg-dark p-5 rounded-lg m-3">
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
                                {avatar}{t('profile.header.title', { username: userForm.username })}
                                <Badge bg={accountState.color} className='ml-2'>{accountState.status}</Badge>
                                </Card.Title>
                            <Card.Subtitle className='mb-2 text-muted' />
                            <Card.Text>{t('profile.header.description')}</Card.Text>
                            <Form.Group controlId="formEmail">
                                <Form.Label>
                                    <OverlayTrigger placement="right" 
                                                    delay={{ show: 250, hide: 400 }} 
                                                    overlay={changeEmailTooltip}>
                                        <Button size='sm' variant={toggleEmail} onClick={changeEmail}>
                                            {t('profile.email.button.edit')}
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
                                        <Button size='sm' variant={togglePwd} onClick={changePassword}>
                                            {t('profile.password.button.edit')}
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
            </div>
        </>
    } else {
        return <>
            <Messenger message={message} setMessage={setMessage} />
            <Loading />
        </>
    }
}

const Messenger = (props) => {
    const { message, setMessage } = props

    const closeModal = () => { setMessage({}) }

    return <>
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
    </>
}

const initPassword = { first: '', second: '', match: false }
const passwordReducer = (state, action) => {
    console.log("GET =>", state, action)
    const [ error, passwordValidated ] = validatePassword(action.value)
    switch(action.type) {
        case 'first':
            return { error,
                     first: action.value, 
                     second: state.second , 
                     match: ((action.value === state.second) && (state.second != '') && passwordValidated) }
        case 'second':
            return { error,
                     first: state.first, 
                     second: action.value, 
                     match: ((action.value === state.first) && (state.first != '') && passwordValidated) }
        default:
            return initPassword
    }
}

const PasswordUpdateModal = (props) => {
    const { showModal, setShowModal, setPasswordToUpdate, setVariant } = props
    const { t } = useTranslation()
    const [ password, setPassword ] = useReducer(passwordReducer, initPassword) 

    console.log("--- Profile <PasswordUpdateModal> component")

    const close = () => { 
        setVariant('outline-light')
        setShowModal(false) }
    const submit = () => {
        console.log("password :", password.first, password.match, password.error)
        if (password.match) { 
            setPasswordToUpdate(password.first)
            setVariant('outline-warning')
        } else {
            setPasswordToUpdate('')
            setVariant('outline-light')
            fireError(password.error.name, password.error.message)
        }
        setShowModal(false)
    }
    const handleChange = name => event => { 
        setPassword( {type: name, value: event.target.value } )
    }

    return <>
        <Modal show={showModal}>
            <Modal.Header closeButton>
                <Modal.Title>{t('profile.modal.update.password.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formPassword">
                        <Form.Label>{t('profile.modal.update.password.first.label')}</Form.Label>
                        <Form.Control type='password' 
                                      placeholder={t('profile.modal.update.password.first.placeholder')}
                                      onChange={handleChange('first')} />
                        <Form.Text className='text-muted'>
                            {t('profile.modal.update.password.first.helper')}
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label>{t('profile.modal.update.password.second.label')}</Form.Label>
                        <Form.Control type='password' 
                                      placeholder={t('profile.modal.update.password.second.placeholder')}
                                      onChange={handleChange('second')} />
                        <Form.Text className='text-muted'>
                            {t('profile.modal.update.password.second.helper')}
                        </Form.Text>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={submit}>
                    {t('profile.modal.update.password.button.submit')}
                </Button>
                <Button onClick={close}>
                    {t('profile.modal.update.password.button.cancel')}
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}


export default Profile
