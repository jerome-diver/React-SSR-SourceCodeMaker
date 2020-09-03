import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { validatePassword } from '../../../Controllers/user/authenticate-api'
import { Modal, Alert, Spinner, Button } from 'react-bootstrap'
import '../../../stylesheet/users.sass'

const Validate = (props) => {
    const { username, token, ticket } = useParams()
    let [load, setLoad] = useState(false)               // Spinner if load is false
    let [validated, setValidated] = useState(false)     // Validation returned true
    let [error, setError] = useState('')                // error process return
    let [show, setShow] = useState(false)               // show Modal dialog box
    let [redirect, setRedirect] = useState('')          // redirection after

    useEffect( () => {
        console.log("Searching to FETCH validation for", username)
        validatePassword(token, ticket)
            .then(response =>  {
                if(response) {
                    setValidated(response.validated)
                    if (response.error) setError(response.error)
                    setShow(true)
                } else setValidated(false)
                setLoad(true)
            })
    }, [] )

    const handleClose = () => { setShow(false) }
    const goHome = () => { setRedirect('/') }
    const signIn = () => { setRedirect('/signin') }

    const renderRedirect = () => { if (redirect !== '') { return <Redirect to={redirect}/> } }

    if (load) {
        if(validated) {
            return (
                <>
                    {renderRedirect()}
                    <Modal show={show}>
                        <Modal.Header closeButton>
                            <Modal.Title>{username} account validation</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Your account has been validated</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={goHome}>
                                Go home
                            </Button>
                            <Button variant="primary" onClick={signIn}>
                                Sign in
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )
        } else {
            return (
                <>
                    <Alert variant='danger'>
                        <h3>Validation for {username} failed</h3>
                        <hr/>
                        <p>Validation status: {validated}</p>
                        <p>{error}</p>
                    </Alert>
                </>
            )
        } }
    else {
        return (
            <>
                <Alert variant='warning'>
                    <Spinner animation='border' role='status'/>
                    <p>Loading...</p>
                </Alert>
            </>
        )
    }
}

export default Validate
