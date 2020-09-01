import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Modal, Spinner, Alert, Button } from 'react-bootstrap'
import { signout } from '../../Controllers/user/authenticate-api'
import { useAuthenticate } from '../../Controllers/context/authenticate'

const SignOut = (props) => {

    const [loaded, setLoaded] = useState(false)
    const [loggedOut, setLoggedOut] = useState(false)
    const [error, setError] = useState('')
    const { getUser, setUserSession } = useAuthenticate()

    useEffect( () => {
        const abort = new AbortController()     // stop to fetch a request if we cancel this page
        const signal = abort.signal
        const user = getUser()
        if (user) {
            signout(user.id, signal).then(result => {
                if(result.error) { setError(result.error) }
                else {
                    setUserSession(0)
                    setLoggedOut(true) }
                setLoaded(true) } )
        }
        return function cleanup() { abort.abort() }
    }, [])

    const closeModal = () => { setError('') }

    if (loaded) {
        if (loggedOut) {
            return (<> <Redirect to='/'/> </>)
        } else {
            return ( <>
                <Modal show={(error != '')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Failed to logout</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert variant='error'>{error}</Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={closeModal}>OK</Button>
                    </Modal.Footer>
                </Modal>
            </>)
        }
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

export default SignOut
