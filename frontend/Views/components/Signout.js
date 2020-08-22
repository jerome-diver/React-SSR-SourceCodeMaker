import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Modal, Spinner, Alert } from 'react-bootstrap'
import { signout } from '../../Controllers/user/authenticate-api'
import { useCookies } from 'react-cookie'

const SignOut = (props) => {

    const [load, setLoad] = useState(false)
    const [loggedOut, setLoggedOut] = useState(false)
    const [error, setError] = useState('')
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'username'])

    useEffect( () => {
        signout().then(result => {
            if(result.error) { setError(result.error) }
            else {
                removeCookie('token')
                removeCookie('username') 
                setLoggedOut(true) }
            setLoad(true)
        })
    }, [])


    if (load) {
        if (loggedOut) {
            return (<> <Redirect to='/'/> </>)
        } else {
            return ( <>
                <Modal show={true}>
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
