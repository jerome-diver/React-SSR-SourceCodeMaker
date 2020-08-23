import React, { useEffect, useState, useReducer } from 'react'
import { Redirect } from 'react-router-dom'
import { useLocation } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { Card, Button, Form, Spinner, Alert, Modal } from 'react-bootstrap'
import { useAuth } from '../../Controllers/context/authenticate'
import { signin } from '../../Controllers/user/authenticate-api'
import { cypher } from '../../Controllers/user/user-form-helper'

const reducer = (state, action) => {
    switch (action.isLogged) {
        case true:
            return { isLogged: true,
                     hasError: false,
                     error: '',
                     from: action.from,
                     user: action.user }
        case false:
            return { isLogged: false,
                     hasError: true,
                     error: action.error,
                     from: state.from,
                     user: state.user}
        default:
            return { isLogged: false, error: "Wrong reduction"}
    }
}

const SignIn = (props) => {

    const [load, setLoad] = useState(false)
    const [submit, setSubmit] = useState(false)
    const [sign, dispatch] = useReducer(reducer, { isLogged: false, hasError:false,
                                                   error: '', from: '/login', user: {} })
    const [form, setForm] = useState({})
    const { data, setAuthTokens } = useAuth()
    const location = useLocation()
  
    useEffect( () => {
        console.log("UseEffect of Signin Page component call")
        setLoad(!submit)
    }, [submit] )

    const getError = (error) => { 
        dispatch({isLogged: false, error: error})
        setSubmit(false) }
    const getLoggedUser = (who, token) => {
        dispatch({from: location.state.from, user: who, isLogged: true})
        setSubmit(false)
        setAuthTokens({token: token, username: who.username}) 
    }
    const handleChange = name => e => {
        if (!submit && name !== '') { setForm({...form, [name]: e.target.value}) }
    }
    const clickSubmit = (e) => {
        e.preventDefault()
        setSubmit(true)
        const hashed_password = (form.password) ? cypher(form.password) : ''
        signin(form.username, form.email, hashed_password)
            .then( (data) => (data.error) 
                                ? getError(data.error) 
                                : getLoggedUser(data.user, data.token) )
            .catch((error) => { getError(error) } )
    }
    const closeModal = () => { setHasError(false) }

    if (load) {
        if(sign.isLogged) { return ( <> <Redirect to={sign.from}/> </> ) } 
        else {
          return (
            <>  
              <Modal show={sign.hasError}>
                  <Modal.Header closeButton>
                      <Modal.Title>Failed to login</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <Alert variant='error'>{sign.error}</Alert>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button onClick={closeModal}>OK</Button>
                  </Modal.Footer>
              </Modal>
              <Card id='sign'>
                <Card.Body>
                    <Card.Title><FontAwesomeIcon icon={ faUserCheck } /> Sign in</Card.Title>
                    <Card.Subtitle className='mb-2 text-muted' />
                    <Card.Text>If you failed to sign in 2 times, an email will be sent to your email box.</Card.Text>
                    <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Your email of this account</Form.Label>
                        <Form.Control type='email' placeholder='enter email' 
                                      onChange={handleChange('email')}
                                      defaultValue={form.email} />
                        <Form.Text className='text-muted'>I will never share your email with anyone else.</Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicText">
                        <Form.Label>OR, your username</Form.Label>
                        <Form.Control type='text' placeholder='username'
                                      onChange={handleChange('username')}
                                      defaultValue={form.username} />
                        <Form.Text className="text-muted">he is unique there...</Form.Text>
                    </Form.Group>
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
