import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { Card, Button, Form, Spinner, Alert, Modal } from 'react-bootstrap'
import { useAuth } from '../../Controllers/context/authenticate'
import { signin } from '../../Controllers/user/authenticate-api'
import { cypher } from '../../Controllers/user/user-form-helper'

const SignIn = (props) => {

    const [user, setUser] = useState({})
    const [load, setLoad] = useState(false)
    const [isLogged, setIsLogged] = useState(false)
    const [error, setError] = useState((props.location) ? props.location.state.error : '')
    const [hasError, setHasError] = useState(error !== '')
    const [submit, setSubmit] = useState(false)
    const [referer, setReferer] = useState('/')
    const { token, setAuthTokens } = useAuth()
  
    useEffect( () => {
        console.log("UseEffect of Signin Page component call")
        if(!submit) { setLoad(true) }
    }, [submit] )

    const getError = (error) => { setSubmit(false); setError(error); setHasError(true); }
    const getLoggedUser = (who, token) => {
        setSubmit(false)
        setUser(who)
        setReferer(`/profile/${who.username}`)
        setAuthTokens(token) 
        setIsLogged(true) }
    const handleChange = name => e => {
        if (!submit && name !== '') { setUser({...user, [name]: e.target.value}) }
    }
    const clickSubmit = (e) => {
        e.preventDefault()
        setSubmit(true)
        const hashed_password = (user.password) ? cypher(user.password) : ''
        signin(user.username, user.email, hashed_password)
            .then( (data) => (data.error) 
                                ? getError(data.error) 
                                : getLoggedUser(data.user, data.token) )
            .catch((error) => { getError(error) } )
    }
    const closeModal = () => { setHasError(false) }

    if (load) {
        if(isLogged) { return ( <> <Redirect to={referer}/> </> ) } 
        else {
          return (
            <>  
              <Modal show={hasError}>
                  <Modal.Header closeButton>
                      <Modal.Title>Failed to login</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <Alert variant='error'>{error}</Alert>
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
                                      defaultValue={user.email} />
                        <Form.Text className='text-muted'>I will never share your email with anyone else.</Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicText">
                        <Form.Label>OR, your username</Form.Label>
                        <Form.Control type='text' placeholder='username'
                                      onChange={handleChange('username')}
                                      defaultValue={user.username} />
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
