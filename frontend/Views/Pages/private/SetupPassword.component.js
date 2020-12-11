import React, { useState, useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { Modal, Alert, Button, Card, Form, InputGroup } from 'react-bootstrap'
import '../../../stylesheet/users.sass'
import { updatePassword } from '../../../Controllers/user/authenticate-api'
import { validatePassword } from '../../../Controllers/user/user-form-helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faUserEdit } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import parse from 'html-react-parser'
import { Loading } from '../public/Printers.component'

const reducer = (state, action) => {
    switch (action.validated) {
        case true:
            return { error: action.error, show: action.show, validated: true, process: action.process }
        case false:
            return { error: action.error, show: action.show, validated: false, process: 'Prending' }
    }
}


const SetupPassword = (props) => {
    const { id, ticket } = useParams()
    const [ load, setLoad ] = useState(false)               // Spinner if load is false
    const [ redirect, setRedirect ] = useState('')          // redirection after
    const [ form, setForm ] = useState({password: '', confirmed_password: ''})
    const [ status, dispatch ] = useReducer(reducer, { error: false, show:false, validated: false, process: 'Pending'})
    const { i18n, t } = useTranslation()

    useEffect( () => {
        console.log("---SetupPassword component [useEffect]", status)
        setLoad(true)
    } )

    const handleSubmit = (e) => {
        const form_to_submit = e.currentTarget;
        if (form_to_submit.checkValidity() === false) {
            console.log("--- SetupPassword component [handleSubmit]")
            e.preventDefault();
            e.stopPropagation();
        } else {
            e.preventDefault()
            const [ error, passwordValidated ] = validatePassword(form.password)
            if (!passwordValidated) dispatch({process: 'Failed', error: error, validated: true, show: true })
            else {
                if (form.password == form.confirmed_password) {
                    updatePassword(id, ticket, form.password)  // !!! should call a user-form-helper to set new password after to get new one
                    .then((response) => {
                        const process = (response.error) ? 'Failed' : 'Success'
                        dispatch({ error: response.error, process: process, show: true, validated: true} )
                    })
                } else dispatch({error: { name: t('setup.password.error.name'), 
                                          message: t('setup.password.error.message')},
                                 process: 'Failed', show: true, validated: true } )
        } }
    }
    const handleChange = name => e => { if (name !== '') setForm({...form, [name]: e.target.value}) }
    const handleClose = () => { dispatch({show: false, process: 'Pending', error: '', validated: false}) }
    const goHome = () => setRedirect('/')
    const goSignIn = () => setRedirect('/signin')

    let title, content
    if (redirect !== '') return <Redirect to={redirect}/> 
    if (load) {
        switch(status.process) {
            case 'Success':
                title = t('setup.password.modal.success.title')
                content = (<>
                        <Alert variant='success'>
                            <h3>{t('setup.password.modal.success.subtitle')}</h3>
                            <hr/>
                            <p>{t('setup.password.modal.success.content')}</p>
                        </Alert>
                    </>)
                break
            case 'Failed':
                title = status.error.name
                content = (<>
                        <Alert variant='danger'>
                            <h3>{t('setup.password.modal.failed.subtitle')}</h3>
                            <hr/>
                            {parse(status.error.message)}
                        </Alert>
                    </>) 
                break
        }
        return (<>
            <Modal show={status.show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{content}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={goHome}>{t('setup.password.modal.button.home')}</Button>
                    <Button variant="primary" onClick={goSignIn}>{t('setup.password.modal.button.signin')}</Button>
                </Modal.Footer>
            </Modal>
            <Card id='sign'>
                <Form noValidate validated={status.validated} onSubmit={handleSubmit} >
                    <Card.Header><h2><FontAwesomeIcon icon={ faUserEdit } /> {t('setup.password.header')}</h2></Card.Header>
                    <Card.Body>
                        <Card.Title>{t('setup.password.title')}</Card.Title>
                        <Card.Subtitle className='mb-2 text-muted'>{t('setup.password.subtitle')}</Card.Subtitle> 
                        <Card.Text>{t('setup.password.description')}</Card.Text>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>{t('setup.password.first.label')}</Form.Label>
                            <InputGroup>
                                <Form.Control type='password' placeholder={t('setup.password.first.placeholder')} 
                                              onChange={handleChange('password')} />
                                <Form.Control.Feedback type="invalid">{t('setup.password.first.feedback')}</Form.Control.Feedback>
                            </InputGroup>
                            <Form.Text className='text-muted'>{t('setup.password.first.dscription')}</Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>{t('setup.password.second.label')}</Form.Label>
                            <InputGroup>
                                <Form.Control type='password' placeholder={t('setup.password.second.label')} 
                                              onChange={handleChange('confirmed_password')} />
                                <Form.Control.Feedback type="invalid">{t('setup.password.second.feedback')}</Form.Control.Feedback>
                            </InputGroup>
                            <Form.Text className='text-muted'>{t('setup.password.second.description')}</Form.Text>
                        </Form.Group>
                    </Card.Body>
                    <Card.Footer>
                        <Button type='submit'>
                            <FontAwesomeIcon icon={ faKey }/>{t('setup.password.button.submit')}
                        </Button>
                    </Card.Footer>
                </Form>
            </Card> 
        </>)

    } else return <><Loading/></>
}

export default SetupPassword

