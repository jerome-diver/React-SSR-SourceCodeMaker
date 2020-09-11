import React, { useEffect, useReducer } from 'react'
import { Redirect } from 'react-router-dom'
import { Modal, Spinner, Alert, Button } from 'react-bootstrap'
import { signout } from '../../Controllers/user/authenticate-api'
import { useAuthenticate } from '../../Controllers/context/authenticate'

const reducer = (state, action) => {
    return { loaded: action.loaded,
             error: action.error,
             loggedOut: action.loggedOut }
}

const SignOut = (props) => {
        console.log("--- Start SignOut ---")

    const { getUser, setSession } = useAuthenticate()
    const [ state, dispatch ] = useReducer(reducer, { loggedOut: false, loaded: false })

    useEffect( () => {
        const abort = new AbortController()
        const signal = abort.signal
        logOut(getUser(), signal)
        return function cleanup() { abort.abort() }
    }, [])

    const logOut = (user, signal) => {
        if (user) {
            signout(user.id, signal).then(result => {
                if (result.error) dispatch({error: result.error, loggedOut: false, loaded: true}) 
                else if (result == true) setSession(0)
                else dispatch({loaded: true, loggedOut: false, error: 'LogOut rejected'}) } )
        } else { dispatch({loaded: true, loggedOut: true, error: ''}) }
    }
    const closeModal = () => { setError('') }

    if (state.loaded) {
        if (state.loggedOut) {
            return (<> <Redirect to='/'/> </>)
        } else {
            return ( <>
                <Modal show={(error != '')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Failed to logout</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert variant='error'>{state.error}</Alert>
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
