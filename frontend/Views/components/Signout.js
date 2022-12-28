import React, { useEffect, useReducer } from 'react'
import { Redirect } from 'react-router-dom'
import { Modal, Spinner, Alert, Button } from 'react-bootstrap'
import { signout } from '../../Controllers/user/authenticate-api'
import { useAuthenticate } from '../../Controllers/context/authenticate'

const reducer = (state, action) => {
    return { error: action.error,
             loggedOut: action.loggedOut }
}

const SignOut = (props) => {
        console.log("--- Start SignOut ---")

    const { getUser, setSession } = useAuthenticate()
    const [ state, dispatch ] = useReducer(reducer, { loggedOut: false })

    useEffect( () => {
        const abort = new AbortController()
        const signal = abort.signal
        logOut(getUser(), signal)
        return function cleanup() { abort.abort() }
    })

    const logOut = (user, signal) => {
        if (user) {
            signout(user.id, signal).then(result => {
                if (result.error) dispatch({error: result.error, loggedOut: false}) 
                else if (result === true) setSession(0)
                else dispatch({loggedOut: false, error: 'LogOut rejected'}) } )
        } else { dispatch({loggedOut: true, error: ''}) }
    }
    const closeModal = () => { dispatch( {error: ''} ) }

    if (state.loggedOut) { return (<> <Redirect to='/'/> </>)
    } else { return ( <>
        <Modal show={(state.error !== '')}>
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
    </>) }
}

export default SignOut
