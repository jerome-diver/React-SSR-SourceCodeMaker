import React, { useEffect, useState, useReducer } from 'react'
import { Redirect } from 'react-router-dom'
import { useLocation } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { Card, ToggleButtonGroup, ToggleButton, Button, Form, Spinner, Alert, Modal } from 'react-bootstrap'
import { useAuthenticate } from '../../Controllers/context/authenticate'
import { useCookies } from 'react-cookie'
import { signin, setupPassword } from '../../Controllers/user/authenticate-api'
import { cypher } from '../../Controllers/user/user-form-helper'

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
    const [ form, setForm ] = useState({})
    const { getUser, setUserSession } = useAuthenticate()
    const [ selectIdentifier, setSelectIdentifier ] = useState('Email')
    const location = useLocation()
    const [ cookies, setCookies, removeCookies ] = useCookies(['session'])
  
    useEffect( () => {
        console.log("UseEffect of Signin Page component call")
        console.log('Location is', location)
        setLoaded(!submit)
    }, [submit] )

    const getError = (error) => { 
        console.log("FAILED to signed in")
        dispatch({isLogged: false, error: error, hasError: true})
        setSubmit(false) }
    const getLoggedUser = (data) => {
        console.log("OK, signed in for ", data.user.username)
        const go_to = (location.state) ? location.state.from : '/profile'
        dispatch({from: go_to, isLogged: true})
        setUserSession( data ) 
        setSubmit(false)
    }
    const getSetupPassword = () => {

    }
    const handleChange = name => e => {
        if (!submit && name !== '') { setForm({...form, [name]: e.target.value}) }
    }
    const forgetPassword = () => {
        setupPassword(form.username).then(response => {
            (response.error) ? getError(response.error) : getSetupPassword() } )
    }
    const sendValidationAgain = () => { 
        //
    }
    const clickSubmit = (e) => {
        e.preventDefault()
        setSubmit(true)
        const hashed_password = (form.password) ? cypher(form.password) : ''
        const id = (selectIdentifier == 'Email') ? form.email : form.username
        signin(id, selectIdentifier, hashed_password)
            .then(data => (data.error) ? getError(data.error) : getLoggedUser(data) )
            .catch(error => { getError(error) } )
    }
    const closeModal = () => { dispatch({isLogged: false, error: '', hasError: false}) }
    const switchIdentifier = (status) => { setSelectIdentifier(status) }
    const renderRedirect = () => { if (cookies.session && cookies.session.user) { return <Redirect to={'/'}/> } }

    if (loaded) {
        if(sign.isLogged) { return ( <> <Redirect to={sign.from}/> </> ) } 
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
              {renderRedirect()}
                <Card.Body>
                    <Card.Title><FontAwesomeIcon icon={ faUserCheck } /> Sign in</Card.Title>
                    <Card.Subtitle className='mb-2 text-muted' />
                    <Card.Text>If you failed to sign in 2 times, an email will be sent to your email box.</Card.Text>
                    <Form>
                        <span>Select identifier</span>
                        <ToggleButtonGroup name='IdentifierSelector' value={selectIdentifier}
                                           onChange={switchIdentifier} 
                                           size='sm' 
                                           aria-label="identifier selector">
                            <ToggleButton value='Email' variant="secondary">Email</ToggleButton>
                            <ToggleButton value='Username' variant="secondary">Username</ToggleButton>
                        </ToggleButtonGroup>
                        { (selectIdentifier == 'Email') ?
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Your email</Form.Label>
                                <Form.Control type='email' placeholder='enter email' 
                                              onChange={handleChange('email')}
                                              defaultValue={form.email} />
                                <Form.Text className='text-muted'>I will never share your email with anyone else.</Form.Text>
                            </Form.Group> 
                        : <Form.Group controlId="formBasicText">
                                <Form.Label>Your username</Form.Label>
                                <Form.Control type='text' placeholder='username'
                                              onChange={handleChange('username')}
                                              defaultValue={form.username} />
                                <Form.Text className="text-muted">he is unique there...</Form.Text>
                            </Form.Group> }
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Your password</Form.Label>
                        <Form.Control type='password' placeholder='password' 
                                      onChange={handleChange('password')} />
                        <Form.Text className='text-muted'>please, you should provide your password</Form.Text>
                    </Form.Group>
                    </Form>
                    <Card.Link>
                        <Button type='submit'><FontAwesomeIcon icon={ faUserCheck }
                                onClick={clickSubmit}/></Button>
                    </Card.Link>
                    <Card.Link href='/signup'>I don't have an account</Card.Link>
                    <Card.Link href='#' onClick={forgetPassword}>I forget my password</Card.Link>
                    <Card.Link href='#' onClick={sendValidationAgain}>Send an other validation</Card.Link>
                </Card.Body>
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

export default SignIn
