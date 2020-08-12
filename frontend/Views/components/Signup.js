import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { Card, Button, Form, Spinner } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { create } from '../../Controllers/user/action-api'
import { checkPassword } from '../../Controllers/user/user-form-helper'

const SignUp = (props) => {
    const [user, setUser] = useState({ username: "", email: '', pass1: '', pass2: ''})
    const [load, setLoad] = useState(false)
    const [redirect, setRedirect] = useState(0)
    
    useEffect( () => {
        console.log("UseEffect of AdminPage component call")
        setLoad(true)
    }, [] )
    
    const handleChange = name => event => { 
        console.log('Event handled for: ' + name + ' with value: ' + event.target.value)
        setUser({...user, [name]: event.target.value}) }

    const clickSubmit = () => {
        if (user.pass1 === user.pass2) {
            var passwordValidated = true
            var message = "<h6>need:</h6>"
            const check = checkPassword(user.pass1)
            if (!check.countEnough) { passwordValidated = false; message += '<p>more chars (8 minimum)</p>'; }
            if (!check.special) { passwordValidated = false;  message += '<p>a special char inside</p>' }
            if (!check.upperCase) { passwordValidated = false; message += '<p>a upper case char inside</p>' }
            if (!check.lowerCase) { passwordValidated = false; message += '<p>a lower case char inside</p>'  }
            if (!check.aNumber) { passwordValidated = false; message += '<p>a numeric char inside</p>' }
            if (passwordValidated) {
                console.log('Password check success')
                create(user).then((response) => {
                    if (!response.accepted) { Swal.fire('Signup Failed', response.error, 'error') }
                    else { 
                        Swal.fire({ 
                                title: 'Singup process success', 
                                html:  '<p>Look at your email box, then click on the link to validate your registration</p>',
                                icon:  'success',
                                showCancelButton: true,
                                cancelButtonText: "Home page",
                                confirmButtonText: "Try to Signin" } )
                            .then((result) => {
                                if (result.value) { setRedirect(1) }
                                else { setRedirect(2) }
                            } ) }
                    } ) }
            else { Swal.fire('Password request failed', message, 'error') } 
        }
    }

    const renderRedirect = () => {
        switch (redirect) {
            case 1:
                return <Redirect to='/signin'/>
                break
            case 2:
                return <Redirect to='/'/>
                break
        }
    }

    if (load) {
        return (
            <Card id='sign'>
            {renderRedirect()}
                <Card.Body>
                    <Card.Title><FontAwesomeIcon icon={faUserPlus} /> Sign up</Card.Title>
                    <Card.Subtitle className='mb-2 text-muted' />
                    <Card.Text>After to register, you will have to check your email box and validate your account by click on the contained link to confirm.</Card.Text>
                    <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Your email of this account</Form.Label>
                        <Form.Control type='email' placeholder='enter email' onChange={handleChange('email')} />
                        <Form.Text className='text-muted'>I will never share your email with anyone else.</Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicText">
                        <Form.Label>OR, your username</Form.Label>
                        <Form.Control type='text' placeholder='username' onChange={handleChange('username')} />
                        <Form.Text className="text-muted">he is unique there...</Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Your password</Form.Label>
                        <Form.Control type='password' placeholder='password' onChange={handleChange('pass1')} />
                        <Form.Text className='text-muted'>total of 8 chars minimum, include: 1 or more number and special chars</Form.Text>
                    </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Confirm your password</Form.Label>
                            <Form.Control type='password' placeholder='password again' onChange={handleChange('pass2')} />
                            <Form.Text className='text-muted'>hit  again, you can not copy/paste</Form.Text>
                        </Form.Group>
                    </Form>
                    <Card.Link>
                        <Button type='submit' onClick={clickSubmit}><FontAwesomeIcon icon={faUserPlus} /></Button>
                    </Card.Link>
                    <Card.Link href='/signin'>I already have an account</Card.Link>
                </Card.Body>
            </Card>
        )
    } else {
        return (
            <>
                <Spinner animation='border' role='status'/>
                <p>Loading...</p>
            </>
        )
    }
}

export default SignUp
