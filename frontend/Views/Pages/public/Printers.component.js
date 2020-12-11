import React, { useState } from 'react'
import { Spinner, Alert, Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const Loading = (props) => {
    const { t } = useTranslation()

    return (
        <>
            <Alert variant='info'>
                <Spinner animation='border' role='status'/>
                <p>{t('general.loading')}</p>
            </Alert>
        </>
    )
}

const Error = (props) => {
    const { title, name, message } = props
    const { t } = useTranslation()
    const [ show, setShow ] = useState(true)

    const handleClose = () => { setShow(false) }

    return ( <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert variant='danger'>
                    <h3>{name}</h3>
                    <p>{message}</p>
                </Alert>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {t('error:modal.button.close')}
                </Button>
            </Modal.Footer>
        </Modal>
    </> )
}

export { Loading, Error }

