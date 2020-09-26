import React, { useState, useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { Modal, Alert, Spinner, Button, Card, Form, InputGroup } from 'react-bootstrap'
import '../../../stylesheet/users.sass'
import { updatePassword } from '../../../Controllers/user/authenticate-api'
import { validatePassword } from '../../../Controllers/user/user-form-helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faUserCheck, faUserEdit } from '@fortawesome/free-solid-svg-icons'
import parse from 'html-react-parser'
import Loading from './Loading.component'

const reducer = (state, action) => {
    switch (action.validated) {
        case true:
            return { error: action.error, show: action.show, validated: true, process: action.process }
        case false:
            return { error: action.error, show: action.show, validated: false, process: 'Prending' }
    }
}


const SetupPassword = (props) => {
    const { id, ticket } = useParams()
    const [ load, setLoad ] = useState(false)               // Spinner if load is false
    const [ redirect, setRedirect ] = useState('')          // redirection after
    const [ form, setForm ] = useState({password: '', confirmed_password: ''})
    const [ status, dispatch ] = useReducer(reducer, { error: false, show:false, validated: false, process: 'Pending'})

    useEffect( () => {
        console.log("---SetupPassword component--- useEffect enter", status)
        setLoad(true)
    } )

    const handleSubmit = (e) => {
        const form_to_submit = e.currentTarget;
        if (form_to_submit.checkValidity() === false) {
            console.log("I'm in form_submit condition space")
            e.preventDefault();
            e.stopPropagation();
        } else {
            console.log("Validity is done")
            e.preventDefault()
            const [ error, passwordValidated ] = validatePassword(form.password)
            if (!passwordValidated) dispatch({process: 'Failed', error: error, validated: true, show: true })
            else {
                if (form.password == form.confirmed_password) {
                    console.log("password are the same")
                    updatePassword(id, ticket, form.password)  // !!! should call a user-form-helper to set new password after to get new one
                    .then((response) => {
                        const process = (response.error) ? 'Failed' : 'Success'
                        dispatch({ error: response.error, process: process, show: true, validated: true} )
                    })
                } else dispatch({error: { name: 'Failed to setup password', 
                                          message: 'Password confirmed is not the same as password to setup'},
                                 process: 'Failed', show: true, validated: true } )
        } }
    }
    const handleChange = name => e => { if (name !== '') setForm({...form, [name]: e.target.value}) }
    const handleClose = () => { dispatch({show: false, process: 'Pending', error: '', validated: false}) }
    const goHome = () => setRedirect('/')
    const goSignIn = () => setRedirect('/signin')

    let title, content
    if (redirect !== '') return <Redirect to={redirect}/> 
    if (load) {
        switch(status.process) {
            case 'Success':
                title = "Setup new password Success"
                content = (<>
                        <Alert variant='success'>
                            <h3>Happy to setup your new password</h3>
                            <hr/>
                            <p>You can directly access your account with this new one.</p>
                        </Alert>
                    </>)
                break
            case 'Failed':
                title = status.error.name
                content = (<>
                        <Alert variant='danger'>
                            <h3>Error status:</h3>
                            <hr/>
                            {parse(status.error.message)}
                        </Alert>
                    </>) 
                break
        }
        return (<>
            <Modal show={status.show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{content}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={goHome}>Go Home</Button>
                    <Button variant="primary" onClick={goSignIn}>Sign In</Button>
                </Modal.Footer>
            </Modal>
            <Card id='sign'>
                <Form noValidate validated={status.validated} onSubmit={handleSubmit} >
                    <Card.Header><h2><FontAwesomeIcon icon={ faUserEdit } /> User password</h2></Card.Header>
                    <Card.Body>
                        <Card.Title>Setup your new password</Card.Title>
                        <Card.Subtitle className='mb-2 text-muted'>Consider to have minimum 8 chars contain some low case and upper case character, special character, number</Card.Subtitle> 
                        <Card.Text>You have 2 hours to setup a new password</Card.Text>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Your new password</Form.Label>
                            <InputGroup>
                                <Form.Control type='password' placeholder='password' 
                                              onChange={handleChange('password')} />
                                <Form.Control.Feedback type="invalid">Please choose a valid password.</Form.Control.Feedback>
                            </InputGroup>
                            <Form.Text className='text-muted'>Your password should be difficult to find, may i have to tell you that ?</Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Your confirmed password</Form.Label>
                            <InputGroup>
                                <Form.Control type='password' placeholder='confirm password' 
                                              onChange={handleChange('confirmed_password')} />
                                <Form.Control.Feedback type="invalid">Please provide the same valid password</Form.Control.Feedback>
                            </InputGroup>
                            <Form.Text className='text-muted'>Copy your password to be the same (check no error entry)</Form.Text>
                        </Form.Group>
                    </Card.Body>
                    <Card.Footer>
                        <Button type='submit'>
                            <FontAwesomeIcon icon={ faKey }/> Submit
                        </Button>
                    </Card.Footer>
                </Form>
            </Card> 
        </>)

    } else return <><Loading/></>
}

export default SetupPassword

