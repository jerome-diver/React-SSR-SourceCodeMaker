import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { Modal, Alert, Spinner, Button, Form } from 'react-bootstrap'
import '../../../stylesheet/users.sass'
import { updatePassword } from '../../../Controllers/user/authenticate-api'
import { fireError } from '../../../Controllers/user/user-form-helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons'

const SetupPassword = (props) => {
    const { id, ticket } = useParams()
    const [ load, setLoad ] = useState(false)               // Spinner if load is false
    const [ error, setError ] = useState('')                // error process return
    const [ show, setShow ] = useState(false)               // show Modal dialog box
    const [ redirect, setRedirect ] = useState('')          // redirection after
    const [ validated, setValidated ] = useState(false)
    const [ form, setForm ] = useState({password: '', confirmed_password: ''})

    useEffect( () => {
        console.log("---SetupPassword component--- useEffect enter")
    }, [] )

    const handleClose = () => { setShow(false) }
    const handleSubmit = () => {
        if (form.password == form.confirmed_password) {
            updatePassword(id, ticket, form.password)  // !!! should call a user-form-helper to set new password after to get new one
            .then((response) => {
                if(response.error) {
                    setStatus('Failed')
                 }
                if(response) {
                    setSetupPassword(transaction.validated)
                    if (transaction.error) { setError(transaction.error) }
                    setShow(true)
                } else { setSetupPasswordd(false) }
                setLoad(true)
            })
        } else fireError('password error', 'Password confirmed is not the same as password to setup')
    }
    const handleChange = name => e => { if (!submit && name !== '') setForm({...form, [name]: e.target.value}) }
    const goHome = () => { setRedirect('/') }
    const signIn = () => { setRedirect('/signin') }

    let title, content, buttonLeftText, buttonLeftAction, buttonRightText, buttonRightAction
    if (redirect !== '') return <Redirect to={redirect}/> 
    if (load) {
        switch(status) {
            case 'Success':
                title = "Setup new password Success"
                content = () => {
                    return (<>
                        <Alert variant='success'>
                            <hr/>
                            <p>Happy to setup your new password</p>
                            <p>You can directly access your account with this new one.</p>
                        </Alert>
                    </>) }
                buttonLeftText = "Go Home"
                buttonLeftAction = () => { return (<> <Redirect to='/' /> </>) }
                buttonRightText = "Sign In"
                buttonRightAction = () => { return (<> <Redirect to='/signin' /> </>) }
                break
            case 'Failed':
                title = "Failed to setup password"
                content = () => {
                    return (<>
                        <Alert variant='danger'>
                            <hr/>
                            <p>Error status:</p>
                            <p>{error.message}</p>
                        </Alert>
                    </>) }
                buttonLeftText = "Go Home"
                buttonLeftAction = () => { return (<> <Redirect to='/' /> </>) }
                buttonRightText = "Sign In"
                buttonRightAction = () => { return (<> <Redirect to='/signin' /> </>) }
                break
        }
        return (<>
            <DialogBox title={title} content={content} show={show}
                       buttonLeftText={buttonLeftText} buttonLeftAction={buttonLeftAction}
                       buttonRightText={buttonRightText} buttonRightAction={buttonRightAction} />
            <Card id='sign'>
                <Form noValidate validated={validated} onSubmit={handleSubmit} >
                    <Card.Header><h2><FontAwesomeIcon icon={ faUserCheck } /> Sign in</h2></Card.Header>
                    <Card.Body>
                        <Card.Title>Setup new password failed</Card.Title>
                        <Card.Subtitle className='mb-2 text-muted'>{error.name}</Card.Subtitle> 
                        <Card.Text>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Your new password</Form.Label>
                                <Form.Control type='password' placeholder='password' 
                                              onChange={handleChange('password')} />
                                <Form.Control.Feedback type="invalid">Please choose a valid password.</Form.Control.Feedback>
                                <Form.Text className='text-muted'>Consider to have minimum 8 chars with low case and upper case character, special character, number</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Your confirmed password</Form.Label>
                                <Form.Control type='password' placeholder='confirmed_password' 
                                              onChange={handleChange('confirmed_password')} />
                                <Form.Control.Feedback type="invalid">Please provide the same valid password</Form.Control.Feedback>
                                <Form.Text className='text-muted'>Copy your password to be the same (check no error entry)</Form.Text>
                            </Form.Group>
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <Button type='submit'>
                            <FontAwesomeIcon icon={ faKey }/> Submit
                        </Button>
                        <FixProblem username={form.username} email={form.email} password={form.password} />
                    </Card.Footer>
                </Form>
            </Card> 
        </>)

    } else {
        return (<>
                <Alert variant='warning'>
                    <Spinner animation='border' role='status'/>
                    <p>Loading...</p>
                </Alert>
        </>)
    }
}

const DialogBox = (props) => {
    const { title, content, buttonLeftText, buttonLeftAction,
            buttonRightText, buttonRightAction, show } = props

    return ( <>
        <Modal show={show}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{content}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={buttonLeftAction}>
                    {buttonLeftText}
                </Button>
                <Button variant="primary" onClick={buttonRightAction}>
                    {buttonRightText}
                </Button>
            </Modal.Footer>
        </Modal>
    </>)

}

export default SetupPassword

