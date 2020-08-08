import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { Card, Button, Form } from 'react-bootstrap'

const SignUp = (props) => {
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
                <Card.Title><FontAwesomeIcon icon={faUserPlus} /> Sign up</Card.Title>
                <Card.Subtitle className='mb-2 text-muted' />
                <Card.Text>After to register, you will have to check your email box and validate your account by click on the contained link to confirm.</Card.Text>
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
                    <Form.Text className='text-muted'>total of 8 chars minimum, include: 1 or more number and special chars</Form.Text>
                </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Confirm your password</Form.Label>
                        <Form.Control type='password' placeholder='password again' />
                        <Form.Text className='text-muted'>hit  again, you can not copy/paste</Form.Text>
                    </Form.Group>
                </Form>
                <Card.Link >
                    <Button type='submit'><FontAwesomeIcon icon={faUserPlus} /></Button>
                </Card.Link>
                <Card.Link href='/signin'>I already have an account</Card.Link>
            </Card.Body>
        </Card>
      } </> 
    )
} else {
  return (<div>Loading SignUp form...</div>)
}
}

export default SignUp
