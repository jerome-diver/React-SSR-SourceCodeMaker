import React, { useEffect, useState, useReducer } from 'react'
import { Redirect } from 'react-router-dom'
import { useLocation } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faMailBulk, faKey } from '@fortawesome/free-solid-svg-icons'
import { Card, ToggleButtonGroup, ToggleButton, Button, InputGroup,
         Collapse, Form, Spinner, Alert, Modal } from 'react-bootstrap'
import { useAuthenticate } from '../../Controllers/context/authenticate'
import { useCookies } from 'react-cookie'
import { signin, setupPassword, validateAccount } from '../../Controllers/user/authenticate-api'
import { cypher } from '../../Controllers/user/user-form-helper'
import { validatePassword, emailHasBeenSent, fireError } from '../../Controllers/user/user-form-helper'
import validator from 'validator'

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
    const [ loaded, setLoaded ] = useState(false)
    const [ submit, setSubmit ] = useState(false)
    const [ sign, dispatch ] = useReducer(reducer, { isLogged: false, hasError:false,
                                                   error: '', from: '/login', user: {} })
    const [ form, setForm ] = useState({email:'', username: '', password: ''})
    const { getUser, setUserSession } = useAuthenticate()
    const [ selectIdentifier, setSelectIdentifier ] = useState('Email')
    const location = useLocation()
    const [ cookies, setCookies, removeCookies ] = useCookies(['session'])
    const [ validated, setValidated ] = useState(false)
  
    useEffect( () => {
        console.log("UseEffect of Signin Page component call")
        console.log('Location is', location)
        setLoaded(!submit)
        focusOnSelectedIdEntry()    // put the cursor at the end of the input entry of selected one
    }, [submit, selectIdentifier] )

    const getError = (error) => { 
        console.log("FAILED to signed in")
        dispatch({isLogged: false, error: error, hasError: true})
        setSubmit(false) }
    const getLoggedUser = (data) => {
        console.log("OK, signed in for ", data.user.username)
        const go_to = (location.state) ? location.state.from : '/profile'
        dispatch({from: go_to, isLogged: true})
        setUserSession( data ) // with Context hook, setter (App component) define cookie (set if data, else remove) to hold session
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
            console.log("I'm in form_submit condition space")
            e.preventDefault();
            e.stopPropagation();
        } else {
            e.preventDefault()
            setSubmit(true)
            const hashed_password = (form.password) ? cypher(form.password) : ''
            const id = (selectIdentifier == 'Email') ? form.email : form.username
            signin(id, selectIdentifier, hashed_password)
                .then(data => (data.error) ? getError(data.error) : getLoggedUser(data) )
                .catch(error => { getError(error) } )
        }
        setValidated(true)
    }
    const handleChange = name => e => { if (!submit && name !== '') setForm({...form, [name]: e.target.value}) }
    const switchIdentifier = (status) => { 
        setSelectIdentifier(status) 
    }

    if (loaded) {
        if (sign.isLogged) return (<> <Redirect to={sign.from}/> </>)
        if (cookies.session && cookies.session.user) return (<> <Redirect to='/' /> </>)
        else {
          return (
            <>  
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
                <Card.Header><h2><FontAwesomeIcon icon={ faUserCheck } /> Sign in</h2></Card.Header>
                <Card.Body>
                    <Card.Title>Authenticate yourself to connect</Card.Title>
                    <Card.Subtitle className='mb-2 text-muted'>your user role will give you some magic power (but only there)</Card.Subtitle> 
                    <Card.Text>If you failed to sign in 2 times, an email will be sent to your email box.</Card.Text>
                    <Form noValidate validated={validated}>
                        <FormIdEntrySelector email={form.email} username={form.username} switcher={switchIdentifier}
                                            selection={selectIdentifier} handleChange={handleChange} />
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Your password</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroupPrepend">
                                        <FontAwesomeIcon icon={ faKey }/>
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type='password' placeholder='password' 
                                            onChange={handleChange('password')} />
                                <Form.Control.Feedback type="invalid">Please choose a valid password.</Form.Control.Feedback>
                            </InputGroup>
                            <Form.Text className='text-muted'>You should provide your password</Form.Text>
                        </Form.Group>
                    </Form>
                </Card.Body>
                <Card.Footer>
                    <Button type='submit' onClick={clickSubmit}>
                        <FontAwesomeIcon icon={ faUserCheck }/> Submit
                    </Button>
                    <FixProblem username={form.username} email={form.email} password={form.password} />
                </Card.Footer>
            </Card> </> 
        ) }
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

const FormIdEntrySelector = (props) => {
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
                            <Form.Control type='email' placeholder='enter email' name='formEmail'
                                            onChange={handleChange('email')}
                                            value={email} />
                            <Form.Control.Feedback type="invalid">Please choose a valid email.</Form.Control.Feedback>
                        </InputGroup>
                        <Form.Text className="text-muted">I will never share with no one, i hate scammers.</Form.Text>
                    </Form.Group> 
                )
            case 'Username':
                return (
                    <Form.Group controlId="formBasicText">
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control type='text' placeholder='username' name="formUsername"
                                            onChange={handleChange('username')}
                                            value={username}/>
                            <Form.Control.Feedback type="invalid">Please choose a username.</Form.Control.Feedback>
                        </InputGroup>
                        <Form.Text className="text-muted">he is unique there...</Form.Text>
                    </Form.Group>
                )
        }
    }

    return (<>
                <span>Your </span>
                <ToggleButtonGroup name='IdentifierSelector' value={selection}
                                   onChange={switcher} 
                                   size='sm' aria-label="identifier selector">
                    <ToggleButton value='Email' variant="secondary">Email</ToggleButton>
                    <ToggleButton value='Username' variant="secondary">Username</ToggleButton>
                </ToggleButtonGroup>
                { selectedEntry() }
    </>)
}

const FixProblem = (props) => {
    const { username, email, password } = props
    const [ redirect, setRedirect ] = useState('')
    const [ collapse, setCollapse ] = useState(false)

    const toggle = () => { setCollapse(!collapse)}
    const getSetupPassword = () => { }
    const forgetPassword = () => {
        setupPassword(form.username).then(response => {
            (response.error) ? getError(response.error) : getSetupPassword() } )
    }
    const sendValidationAgain = () => { 
        validateAccount(username)
            .then(response => { 
                console.log('GET BACK: ', response.sent, response.error)
                if(response.sent) emailHasBeenSent(emailSuccess, emailFailed)
                else fireError('Failed to send email', response.error) } )
            .catch(error => fireError(error.name, error.message))
    }
    const emailFailed = () => { setRedirect(location.state.from) }
    const emailSuccess = () => { setRedirect('/signin') }

    if (username || (email && validator.isEmail(email))) {
        if (redirect != '') { return ( <Redirect to={redirect} /> )}
        return (
            <>
                <hr/>
                <Card.Link href="#" onClick={toggle}>I have a problem to fix</Card.Link>
                <Collapse in={collapse}>
                    <div>
                        { (password && validatePassword(password)[1]) ?
                            (<Card.Link href='#' onClick={sendValidationAgain}>Send an other validation</Card.Link>) :
                            (<Card.Link href='#' onClick={forgetPassword}>I forget my password</Card.Link>) }
                    </div>
                </Collapse>
            </>
        )
    }
    return ( <> <hr/><Card.Link href='/signup'> I don't have an account</Card.Link> </> )
}

export default SignIn
