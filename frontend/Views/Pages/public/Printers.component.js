import React, { useEffect } from 'react'
import { Spinner, Alert } from 'react-bootstrap'
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
    const [ show, setShow ] = useEffect(true)

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
                <Button variant="secondary" onClick={handleClose()}>
                    {t('setup.email.modal.button.home')}
                </Button>
            </Modal.Footer>
        </Modal>
    </> )
}

export default { Loading, Error }

