import React, { useEffect, useState, useReducer } from 'react'
import { Redirect } from 'react-router-dom'
import { useLocation } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faMailBulk, faKey } from '@fortawesome/free-solid-svg-icons'
import { Card, ToggleButtonGroup, ToggleButton, Button, InputGroup,
         Collapse, Form, Alert, Modal } from 'react-bootstrap'
import { useAuthenticate } from '../../Controllers/context/authenticate'
import { useTranslation } from 'react-i18next'
import { signin } from '../../Controllers/user/authenticate-api'
import { validatePassword, sendEmailLink } from '../../Controllers/user/user-form-helper'
import validator from 'validator'
import { Loading } from '../Pages/public/Printers.component'

const reducer = (state, action) => {
    switch (action.isLogged) {
        case true:
            return { isLogged: true,
                     hasError: false,
                     error: null,
                     from: action.from }
        case false:
            return { isLogged: false,
                     hasError: action.hasError,
                     error: action.error,
                     from: state.from }
        default:
            return { isLogged: false, error: "Wrong reduction"}
    }
}

const SignIn = (props) => {
    const { i18n, t } = useTranslation()
    const [ loaded, setLoaded ] = useState(false)
    const [ submit, setSubmit ] = useState(false)
    const [ validated, setValidated ] = useState(false)
    const [ selectIdentifier, setSelectIdentifier ] = useState('Email')
    const [ form, setForm ] = useState({email:'', username: '', password: ''})
    const [ sign, dispatch ] = useReducer(reducer, { isLogged: false, 
                                                     hasError:false,
                                                     error: '', 
                                                     from: '/login', 
                                                     user: {} })
    const { setSession, getUser } = useAuthenticate()
    const location = useLocation()
  
    useEffect( () => {
        console.log("--- SignIn component useEffect")
        console.log('\tLocation is', location)
        setLoaded(!submit)
        focusOnSelectedIdEntry()    // put the cursor at the end of the input entry of selected one
    }, [submit, selectIdentifier, i18n.language] )

    const getError = (error) => { 
        console.log("\tFAILED to sign in")
        dispatch({isLogged: false, error, hasError: true, from: '/login'})
        setSubmit(false) }
    const getLoggedUser = (data) => {
        console.log("\tOK, signed in for ", data.user.username)
        const go_to = (location.state) ? location.state.from : '/profile'
        dispatch({from: go_to, isLogged: true})
        setSession( data ) // with Context hook, setter (App component) define cookie (set if data, else remove) to hold session
        setSubmit(false)
    }
    const focusOnSelectedIdEntry = () => {  // this has to be call AFTER to React refresh view (call it from useEffect)
        const usernameButton = document.querySelector("input[value='Username']")
        const emailButton = document.querySelector("input[value='Email']")
        if(usernameButton && usernameButton.checked) { 
            const usernameInput = document.querySelector("input[name='formUsername']")
            usernameInput.focus() }
        if(emailButton && emailButton.checked) { 
            const emailInput = document.querySelector("input[name='formEmail']")
            emailInput.focus() }
    }

    const closeModal = () => { dispatch({isLogged: false, error: '', hasError: false}) }
    const clickSubmit = (e) => {
        const form_to_submit = e.currentTarget;
        if (form_to_submit.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            console.log("form is ok, next...")
            e.preventDefault()
            setSubmit(true)
            const id = (selectIdentifier == 'Email') ? form.email : form.username
            signin(id, selectIdentifier, form.password)
                .then(data => {
                    if (data.error) throw (data.error)
                    getLoggedUser(data) })
                .catch(error => getError(error) )
        }
        setValidated(true)
    }
    const handleChange = name => e => { if (!submit && name !== '') setForm({...form, [name]: e.target.value}) }
    const switchIdentifier = (status) => { 
        setSelectIdentifier(status) 
    }

    if (loaded) {
        if (sign.isLogged) return <> <Redirect to={sign.from}/> </>
        if (getUser()) return <> <Redirect to='/' /> </>
        else {
          return <>  
              <Modal show={sign.hasError}>
                  <Modal.Header closeButton>
                      <Modal.Title>Failed to login with {sign.error.name}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <Alert variant='error'>{sign.error.message}</Alert>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button onClick={closeModal}>OK</Button>
                  </Modal.Footer>
              </Modal>
              <Card id='sign'>
                <Form onSubmit={clickSubmit} noValidate validated={validated}>
                  <Card.Header><h2><FontAwesomeIcon icon={ faUserCheck } /> {t('signin.title')}</h2></Card.Header>
                  <Card.Body>
                      <Card.Title>{t('signin.header.title')}</Card.Title>
                      <Card.Subtitle className='mb-2 text-muted'>{t('signin.header.intro')}</Card.Subtitle> 
                      <Card.Text>{t('signin.header.description')}</Card.Text>
                      <FormIdEntrySelector email={form.email} username={form.username} switcher={switchIdentifier}
                                           selection={selectIdentifier} handleChange={handleChange} />
                      <Form.Group controlId="formBasicPassword">
                          <Form.Label>{t('signin.password.label')} </Form.Label>
                          <InputGroup>
                              <InputGroup.Prepend>
                                  <InputGroup.Text id="inputGroupPrepend">
                                      <FontAwesomeIcon icon={ faKey }/>
                                  </InputGroup.Text>
                              </InputGroup.Prepend>
                              <Form.Control type='password' placeholder={t('signin.password.placeholder')} 
                                            onChange={handleChange('password')} />
                              <Form.Control.Feedback type="invalid">Failed with password</Form.Control.Feedback>
                          </InputGroup>
                          <Form.Text className='text-muted'>{t('signin.password.helper')}</Form.Text>
                      </Form.Group>
                  </Card.Body>
                  <Card.Footer>
                      <Button type='submit' variant='warning'>
                          <FontAwesomeIcon icon={ faUserCheck }/> {t('signin.button_submit')}
                      </Button>
                      <FixProblem username={form.username} email={form.email} password={form.password} />
                  </Card.Footer>
                </Form>
              </Card> 
        </> }
  } else return <><Loading/></>
}

const FormIdEntrySelector = (props) => {
    const { t } = useTranslation()
    const { email, username, selection, handleChange, switcher } = props
    const selectedEntry = () => {
        switch (selection) {
            case 'Email':
                return (
                    <Form.Group controlId="formBasicEmail">
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroupPrepend">
                                    <FontAwesomeIcon icon={ faMailBulk }/>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control type='email' placeholder={t('signin.email.placeholder')} name='formEmail'
                                            onChange={handleChange('email')}
                                            value={email} />
                            <Form.Control.Feedback type="invalid">Please choose a valid email.</Form.Control.Feedback>
                        </InputGroup>
                        <Form.Text className="text-muted">{t('signin.email.helper')}</Form.Text>
                    </Form.Group> 
                )
            case 'Username':
                return (
                    <Form.Group controlId="formBasicText">
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control type='text' placeholder={t('signin.username.placeholder')} name="formUsername"
                                            onChange={handleChange('username')}
                                            value={username}/>
                            <Form.Control.Feedback type="invalid">Please choose a username.</Form.Control.Feedback>
                        </InputGroup>
                        <Form.Text className="text-muted">{t('signin.username.helper')}</Form.Text>
                    </Form.Group>
                )
        }
    }

    return (<>
                <span>{t('signin.id_first_word')}</span>
                <ToggleButtonGroup name='IdentifierSelector' value={selection}
                                   onChange={switcher} 
                                   size='sm' aria-label="identifier selector">
                    <ToggleButton value='Email' variant="secondary">{t('signin.email.label')}</ToggleButton>
                    <ToggleButton value='Username' variant="secondary">{t('signin.username.label')} </ToggleButton>
                </ToggleButtonGroup>
                { selectedEntry() }
    </>)
}

const FixProblem = ({ username, email, password }) => {
    const { t } = useTranslation()
    const [ redirect, setRedirect ] = useState('')
    const [ collapse, setCollapse ] = useState(false)

    const toggle = () => { setCollapse(!collapse)}
    const forgetPassword = () => {
        const emailSent = sendEmailLink('resetPassword', {username})
        if (emailSent) { setRedirect('/signin') } else { setRedirect(location.state.from) }
    }
    const sendValidationAgain = () => { 
        const emailSent = sendEmailLink('validateAccount', {username})
        if (emailSent) { setRedirect('/signin') } else { setRedirect(location.state.from) }
    }

    if (redirect != '') { return ( <Redirect to={redirect} /> )}
    if (username || (email && validator.isEmail(email))) {
        return (
            <>
                <hr/>
                <Card.Link href="#" onClick={toggle}>{t('signin.link.problem')}</Card.Link>
                <Collapse in={collapse}>
                    <div>
                        { (password && validatePassword(password)[1]) ?
                            (<Card.Link href='#' onClick={sendValidationAgain}>{t('signin.link.validation')}</Card.Link>) :
                            (<Card.Link href='#' onClick={forgetPassword}>{t('signin.link.password_forgotten')}</Card.Link>) }
                    </div>
                </Collapse>
            </>
        )
    }
    return ( <> <hr/><Card.Link href='/signup'> {t('signin.link.no_account')}</Card.Link> </> )
}

export default SignIn
