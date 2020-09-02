import React, { useEffect, useReducer } from 'react'
import { Redirect } from 'react-router-dom'
import { Modal, Spinner, Alert, Button } from 'react-bootstrap'
import { signout } from '../../Controllers/user/authenticate-api'
import { useAuthenticate } from '../../Controllers/context/authenticate'

const reducer = (state, action) => {
    console.log("--- REDUCER --- with loaded:", action.loaded)
    return { loaded: action.loaded,
             error: action.error,
             loggedOut: action.loggedOut }
}

const SignOut = (props) => {
        console.log("--- Start SignOut ---")

    const { getUser, setUserSession } = useAuthenticate()
    const [ state, dispatch ] = useReducer(reducer, { loggedOut: false, loaded: false })

    useEffect( () => {
        console.log("--- useEffect from SignOut --- state:", state)
        const abort = new AbortController()     // stop to fetch a request if we cancel this page
        const signal = abort.signal
        logOut(getUser(), signal)
        
        return function cleanup() { abort.abort() }
    }, [])

    const logOut = (user, signal) => {
        console.log("--- SignOut logOut --- user & state are: ", user, state)
        if (user) {
            signout(user.id, signal).then(result => {
                if (result.error) dispatch({error: result.error, loggedOut: false, loaded: true}) 
                else if (result == true) { 
                    console.log("--- Signout user signed out right now --- state is:", state)
                    setUserSession(0)
                } else { dispatch({loaded: true, loggedOut: false, error: 'LogOut rejected'}) } } )
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
