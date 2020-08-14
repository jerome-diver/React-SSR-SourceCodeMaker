import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { read } from '../../../Controllers/user/action-api'
import { Modal, Jumbotron, Spinner, Badge, Button } from 'react-bootstrap'
import '../../../stylesheet/users.sass'

const Validate = (props) => {
    const { username, ticket } = useParams()
    [load, setLoad] = useState(0)
    [validated, setValidated] = setState(false)
    [error, setError] = setState('')
    [show, setShow] = setState(false)

    useEffect() ( () => {
        fetch(`/api/validate/${username}/${ticket}`)
        .then((response) => response.json() )
        .then((transaction) => {
            if(transaction) {
                setValidated(transaction.validated)
                if (transaction.error) { 
                    setLoad(2)
                    setError(transaction.error) }
                else { 
                    setLoad(1)
                    setShow(true) }
            } else { setLoad(2) }
        })
    }, [] )

    const handleClose = () => { setShow(false) }

    switch(load) {
        case 0:
            return (
                <>
                    <Spinner animation='border' role='status'/>
                    <p>Loading...</p>
                </>
            )
            break
        case 1:
            return (
                <>
                    <Modal show={show}>
                        <Modal.Header closeButton>
                            <Modal.Title>{username} account validation</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Your account has been validated</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleClose}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )
            break
        case 2:
            return (
                <>
                    <h6>Validation for {username} failed</h6>
                    <hr/>
                    <p>{error}</p>
                </>
            )
            break
    }
}

export default Validate
