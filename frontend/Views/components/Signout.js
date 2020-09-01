import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Modal, Spinner, Alert, Button } from 'react-bootstrap'
import { signout } from '../../Controllers/user/authenticate-api'
import { useCookies } from 'react-cookie'
import { useAuthentify } from '../../Controllers/context/authenticate'

const SignOut = (props) => {

    const [load, setLoad] = useState(false)
    const [loggedOut, setLoggedOut] = useState(false)
    const [error, setError] = useState('')
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'username'])
    const { userData, setAuthUser } = useAuthentify()

    useEffect( () => {
        signout(userData.user.id).then(result => {
            if(result.error) { setError(result.error) }
            else {
                removeCookie('session')
                setLoggedOut(true) }
            setLoad(true)
        })
    }, [])

    const closeModal = () => { setError('') }

    if (load) {
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
