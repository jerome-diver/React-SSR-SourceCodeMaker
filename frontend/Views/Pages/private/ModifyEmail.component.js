import React, { useState, useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { Modal, Alert, Button } from 'react-bootstrap'
import { updateEmail } from '../../../Controllers/user/action-CRUD'
import { useTranslation } from 'react-i18next'
import { useAuthenticate } from '../../../Controllers/context/authenticate'
import parse from 'html-react-parser'
import Loading from '../public/Loading.component'
import '../../../stylesheet/users.sass'

const reducer = (state, action) => {
    switch (action.validated) {
        case true:
            return { error: action.error, show: action.show, validated: true, process: action.process }
        case false:
            return { error: action.error, show: action.show, validated: false, process: 'Prending' }
    }
}


const ModifyEmail = (props) => {
    const { id, ticket, new_email } = useParams()
    const [ redirect, setRedirect ] = useState('')          // redirection after
    const [ status, dispatch ] = useReducer(reducer, { error: false, show:false, validated: false, process: 'Pending'})
    const { t } = useTranslation()
    const { getUser } = useAuthenticate()

    useEffect( () => {
        const user = getUser()
        if (id == user.id) {
            updateEmail(ticket, new_email)
                .then(res => res.json())
                .then(response => {
                    if (response.validated === 'failed') { dispatch( {error: response.error, show: true, process: 'Failed'} ) }
                    if (response.validated === 'success') { dispatch( {error: false, show: true, process: 'Success'} ) }
                } )
        } else { dispatch( {error: {name: t('setup.email.error.name'), message: t('setup.email.error.message')}, 
                            show: true, process: 'Failed'}) }
        console.log("--- ModifyEmail component [useEffect]", status)
    }, [status.process])

    const handleClose = () => { dispatch({show: false, process: 'Pending', error: '', validated: false}) }
    const goHome = () => setRedirect('/')
    const goSignIn = () => setRedirect('/signin')

    let title, content
    if (redirect !== '') return <Redirect to={redirect}/> 
    switch(status.process) {
        case 'Success':
            title = t('setup.email.modal.success.title')
            content = (<>
                    <Alert variant='success'>
                        <h3>{t('setup.email.modal.success.subtitle')}</h3>
                        <hr/>
                        <p>{t('setup.email.modal.success.content')}</p>
                    </Alert>
                </>)
            break
        case 'Failed':
            title = status.error.name
            content = (<>
                    <Alert variant='danger'>
                        <h3>{t('setup.email.modal.failed.subtitle')}</h3>
                        <hr/>
                        {parse(status.error.message)}
                    </Alert>
                </>) 
            break
        case 'Pending':
            return <><Loading/></>
    }
    return <>
        <Modal show={status.show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{content}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={goHome}>{t('setup.email.modal.button.home')}</Button>
                <Button variant="primary" onClick={goSignIn}>{t('setup.email.modal.button.signin')}</Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default ModifyEmail
