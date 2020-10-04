import React, { useEffect, useState, Component } from 'react'
import { Spinner, Alert, Modal, Button } from 'react-bootstrap'
import { Route, Redirect } from 'react-router-dom'
import { isAuthenticated, useAuthenticate } from '../../../Controllers/context/authenticate'

const  PrivateRoute = ({component: Component, ...rest}) => {

    const { authority } = rest
    console.log("--- PrivateRoute component: For authority role { authority } props access on demand is:", authority)

    const [ access, setAccess ] = useState(false)
    const [ loaded, setLoaded ] = useState(false)
    const [ error, setError ] = useState('')
    const [ redirect, setRedirect ] = useState('')
    const { getUser } = useAuthenticate()

    useEffect(() => {
        const user = getUser()
        console.log("--- PrivateRoute component useEffect entry point, user is", user)
        if (!user) setError('Undefined user, you need to be logged in.')
        else if (!loaded) {
            if(user) isAuthenticated()
                    .then(response => {
                        setAccess(response.authenticated)
                        setLoaded(true) } )
                    .catch(error => setError(error) ) }
    }, [])

    const closeModal = () => { setError('') }
    const goHome = () => { setRedirect('/'); }

    if (loaded) {
        console.log("Get access ?", access)
        return (
            <Route {...rest} render={ 
                (props) => (access) ? 
                        ( <Component {...props} /> ) :
                        ( <Redirect to={{ pathname: '/signin', 
                                        state: { from: props.location, 
                                                 error: 'Failed to authenticate Token'} }} /> )
            } /> )
    } else {
        if (redirect !== '') { return ( <Redirect to={redirect} /> )}
        return (
            <>
                <Modal show={(error != '')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Failed to authenticate</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert variant='error'>{error}</Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={closeModal}>OK</Button>
                        <Button onClick={goHome}>Go Home</Button>
                    </Modal.Footer>
                </Modal>
                <Alert variant='info'>
                    <Spinner animation='border' role='status'/>
                    <p>Loading...</p>
                </Alert>
            </>
        )
    }
}

export default PrivateRoute
