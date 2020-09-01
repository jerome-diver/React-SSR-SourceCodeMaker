import React, { useEffect, useState, Component } from 'react'
import { Spinner, Alert, Modal, Button } from 'react-bootstrap'
import { Route, Redirect } from 'react-router-dom'
import { isAuthenticated } from '../../../Controllers/user/authenticate-helper'
import { useAuthentify } from '../../../Controllers/context/authenticate'


const  PrivateRoute = ({component: Component, ...rest}) => {

    const { authority } = rest
    console.log("Check for private route access...")
    console.log("For authority role access on demand is:", authority)

    const [ access, setAccess ] = useState(false)
    const [ loaded, setLoaded ] = useState(false)
    const [ error, setError ] = useState('')
    const { getUser, setUserSession } = useAuthentify()
    //const { authority } = rest

    useEffect(() => {
        const user = getUser()
        console.log('Reload PrivateRoute hook with', user)
        if(!loaded) {
            if(user) isAuthenticated(user.id)
                    .then(response => {
                        setAccess(response.authorized)
                        setLoaded(true) } )
                    .catch(error => setError(error) )
        }
    }, [])

    const closeModal = () => { setError('') }

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
