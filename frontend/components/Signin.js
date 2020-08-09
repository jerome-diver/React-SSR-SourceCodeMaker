import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { Card, Button, Form } from 'react-bootstrap'

const SignIn = (props) => {
    const [user, setUser] = useState({ username: "", email: '', pass1: '', pass2: ''})
    const [load, setLoad] = useState(false)
  
    useEffect( () => {
        console.log("UseEffect of AdminPage component call")
        setLoad(true)
    }, [] )

    if (load) {
        return (
            <> { 
              <Card id='sign'>
                  <Card.Body>
                      <Card.Title><FontAwesomeIcon icon={ faUserCheck } /> Sign in</Card.Title>
                      <Card.Subtitle className='mb-2 text-muted' />
                      <Card.Text>If you failed to sign in 2 times, an email will be sent to your email box.</Card.Text>
                      <Form>
                      <Form.Group controlId="formBasicEmail">
                          <Form.Label>Your email of this account</Form.Label>
                          <Form.Control type='email' placeholder='enter email' />
                          <Form.Text className='text-muted'>I will never share your email with anyone else.</Form.Text>
                      </Form.Group>
                      <Form.Group controlId="formBasicText">
                          <Form.Label>OR, your username</Form.Label>
                          <Form.Control type='text' placeholder='username' />
                          <Form.Text className="text-muted">he is unique there...</Form.Text>
                      </Form.Group>
                      <Form.Group controlId="formBasicPassword">
                          <Form.Label>Your password</Form.Label>
                          <Form.Control type='password' placeholder='password' />
                          <Form.Text className='text-muted'>please, you should provide your password</Form.Text>
                      </Form.Group>
                      </Form>
                      <Card.Link >
                          <Button type='submit'><FontAwesomeIcon icon={ faUserCheck } /></Button>
                      </Card.Link>
                      <Card.Link href='/signup'>I don't have an account</Card.Link>
                  </Card.Body>
              </Card>
            } </> 
        )
  } else {
      return (
        <Spinner animation='border' role='status'>
          <span className='sr-only'>Loading...</span>
        </Spinner>
      )
    return (<div>Loading SignIn form...</div>)
  }
}

export default SignIn
