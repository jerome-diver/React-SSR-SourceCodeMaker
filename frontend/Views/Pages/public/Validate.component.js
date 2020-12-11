import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { updateAccount } from '../../../Controllers/user/authenticate-api'
import { Modal, Alert, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Loading } from './Printers.component'
import '../../../stylesheet/users.sass'

const Validate = (props) => {
    const { username, token, ticket } = useParams()
    let [load, setLoad] = useState(false)               // Spinner if load is false
    let [validated, setValidated] = useState(false)     // Validation returned true
    let [error, setError] = useState('')                // error process return
    let [show, setShow] = useState(false)               // show Modal dialog box
    let [redirect, setRedirect] = useState('')          // redirection after
    const { i18n, t } = useTranslation()

    useEffect( () => {
        console.log("Searching to FETCH validation for", username)
        updateAccount(token, ticket)
            .then(response =>  {
                if(response) {
                    setValidated(response.validated)
                    if (response.error) setError(response.error)
                    setShow(true)
                } else setValidated(false)
                setLoad(true)
            })
    }, [i18n.language] )

    const handleClose = () => { setShow(false) }
    const goHome = () => { setRedirect('/') }
    const signIn = () => { setRedirect('/signin') }

    const renderRedirect = () => { if (redirect !== '') { return <Redirect to={redirect}/> } }
    const renderValidationStatus = () => {
        if (validated === 'success') {
            return <>
                <Alert variant='success'>
                    <h3>{t('error:validation.status', {validated: validated})}</h3>
                </Alert>
            </>
        } else {
            return <>
                <Alert variant='danger'>
                    <h3>{t('error:validation.status', {validated: validated})}</h3>
                    <hr/>
                    <p>{error}</p>
                </Alert>
            </>
        }
    }

    if (load) {
        return <>
            {renderRedirect()}
            <Modal show={show}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('error:validation.status', {username: username})}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{renderValidationStatus()}</Modal.Body>
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
    } else return <><Loading /></>
}

export default Validate
