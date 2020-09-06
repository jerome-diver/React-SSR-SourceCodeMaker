import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useLocation } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { Card, Button, Form, Spinner, Alert } from 'react-bootstrap'
import { fireError, validatePassword, 
         sendEmailLinkToValidate, emailHasBeenSent } from '../../Controllers/user/user-form-helper'
import { validateAccount } from '../../Controllers/user/authenticate-api'
import { create } from '../../Controllers/user/action-CRUD'
import { useCookies } from 'react-cookie'

const SignUp = (props) => {
    const [user, setUser] = useState({ username: "", email: '', pass1: '', pass2: ''})
    const [load, setLoad] = useState(false)
    const [submit, setSubmit] = useState(false)
    const [redirect, setRedirect] = useState('')
    const location = useLocation()
    const [ cookies, setCookies, removeCookies ] = useCookies(['session'])
    
    useEffect( () => {
        setLoad(!submit)
    }, [submit] )
    
    const handleChange = name => event => { 
        setUser({...user, [name]: event.target.value}) }

    const emailSentSuccess = () => {
        validateAccount(user.username) 
            .then(response => { 
                console.log('GET BACK: ', response.sent, response.error)
                if(response.sent) emailHasBeenSent(emailSuccess, emailFailed)
                else fireError('Failed to send email', response.error) } )
            .catch(error => fireError(error.name, error.message))
    }
    const emailFailed = () => { setRedirect(location.state.from) }
    const emailSuccess = () => { setRedirect('/signin') }

    const clickSubmit = () => {
        if (user.pass1 === user.pass2) {
            const [ message, passwordValidated ] = validatePassword(user.pass1)
            if (passwordValidated) {
                setSubmit(true)
                create(user)
                    .then(response => {
                        if (response.error) fireError(response.error.name, response.error.message)
                        else if (!response.accepted) fireError('Signup Failed', 'User rejected')
                        else sendEmailLinkToValidate(emailSentSuccess, emailFailed)
                        setSubmit(false) } )
                    .catch(error => fireError(error.name, error.message))
            } else fireError('Password validation failed', message)
        } else fireError('Password request failed', 'Not the same password confirmed')
    }

    const renderRedirect = () => { 
        if (redirect !== '') { return <Redirect to={redirect}/> }
        if (cookies.session && cookies.session.user) { return <Redirect to={'/'}/> }
    }

    if (load) {
        return (
            <Card id='sign'>
            {renderRedirect()}
                <Card.Header><h2><FontAwesomeIcon icon={faUserPlus} /> Sign up</h2></Card.Header>
                <Card.Body>
                    <Card.Title>Create your account</Card.Title>
                    <Card.Subtitle className='mb-2 text-muted'>
                        Come on, let's try to be a wonderful user there in this fantastic web site...
                    </Card.Subtitle> 
                    <Card.Text>After to register, you will have to check your email box and validate your account by click on the contained link to confirm.</Card.Text>
                    <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Your email of this account</Form.Label>
                        <Form.Control type='email' placeholder='enter email'
                                      defaultValue={user.email}
                                      onChange={handleChange('email')} />
                        <Form.Text className='text-muted'>I will never share your email with anyone else.</Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicText">
                        <Form.Label>AND your username</Form.Label>
                        <Form.Control type='text' placeholder='username' 
                                      defaultValue={user.username}
                                      onChange={handleChange('username')} />
                        <Form.Text className="text-muted">he is unique there...</Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Your password</Form.Label>
                        <Form.Control type='password' placeholder='password' onChange={handleChange('pass1')}/>
                        <Form.Text className='text-muted'>total of 8 chars minimum, include 1 or more [number, low cap, high cap and special char]</Form.Text>
                    </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Confirm your password</Form.Label>
                            <Form.Control type='password' placeholder='password again' onChange={handleChange('pass2')} />
                            <Form.Text className='text-muted'>control the first entry by enter the same password again</Form.Text>
                        </Form.Group>
                    </Form>
                </Card.Body>
                <Card.Footer>
                    <Card.Link>
                        <Button type='submit' onClick={clickSubmit}>
                            <FontAwesomeIcon icon={faUserPlus} /> Create
                        </Button>
                    </Card.Link>
                    <Card.Link href='/signin'>I already have an account</Card.Link>
                </Card.Footer>
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
