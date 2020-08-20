import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { Card, Button, Form, Spinner, Alert } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { create, validateAccount } from '../../Controllers/user/action-api'
import { checkPassword } from '../../Controllers/user/user-form-helper'

const SignUp = (props) => {
    const [user, setUser] = useState({ username: "", email: '', pass1: '', pass2: ''})
    const [load, setLoad] = useState(false)
    const [submit, setSubmit] = useState(false)
    const [redirect, setRedirect] = useState('')
    
    const htmlNewUser = "<div class='alert alert-info'><p>A new user has been created, but need a validation to be ready to use.</p>"
    const htmlEmailSent = "<div class='alert alert-success'><p>Check your email account, then click on validate link to get account up.</p></div>"

    useEffect( () => {
        if (!submit) { setLoad(true) }
    }, [submit] )
    
    const handleChange = name => event => { 
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
                setSubmit(true)
                create(user)
                    .then((response) => {
                        if (!response.accepted) { Swal.fire('Signup Failed', response.error, 'error') }
                        else { 
                          Swal.fire({ 
                                title: 'Singup process success', 
                                html:  htmlNewUser,
                                icon:  'warning',
                                showCancelButton: true,
                                cancelButtonText: "go Home",
                                confirmButtonText: "Send email with link to validate" } )
                            .then((result) => { 
                                if (result.value) {
                                    console.log("START TO SEND EMAIL PROCESS")
                                    validateAccount(user.username) 
                                        .then((response) => { 
                                            console.log('GET BACK: ', response.sent, response.error)
                                            if(response.sent) {
                                                Swal.fire({ title: 'Email as been sent', 
                                                            html: htmlEmailSent, 
                                                            icon: 'success',
                                                            showCancelButton: true,
                                                            cancelButtonText: "go Home",
                                                            confirmButtonText: 'Sign in'} )
                                                       .then((result) => { 
                                                           if (result.value) { setRedirect('/signin') } else {setRedirect('/') } } )
                                            } else { Swal.fire('Failed to send email', error, 'error') } } )
                                } else { setRedirect('/') } } ) }
                        setSubmit(false) } )
            } else { Swal.fire('Password request failed', message, 'error') } 
        } else { Swal.fire('Password request failed', 'Not the same password confirmed', 'error') }
    }

    const renderRedirect = () => { if (redirect !== '') { return <Redirect to={redirect}/> } }

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
                <Alert variant='info'>
                    <Spinner animation='border' role='status'/>
                    <p>Loading...</p>
                </Alert>
            </>
        )
    }
}

export default SignUp
