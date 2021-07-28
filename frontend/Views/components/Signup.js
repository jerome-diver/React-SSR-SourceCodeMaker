import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useLocation } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { Card, Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { fireError, validatePassword, sendEmailLink } from '../../Controllers/user/user-form-helper'
import { create } from '../../Controllers/user/action-CRUD'
import { useCookies } from 'react-cookie'
import { Loading, Error } from '../Pages/public/Printers.component'

const SignUp = (props) => {
    const { i18n, t } = useTranslation()
    const [user, setUser] = useState({ username: "", email: '', pass1: '', pass2: ''})
    const [loaded, setLoaded] = useState(false)
    const [submit, setSubmit] = useState(false)
    const [redirect, setRedirect] = useState('signup')
    const location = useLocation()
    const [ cookies, setCookies, removeCookies ] = useCookies(['session'])
    
    useEffect( () => {
        setLoaded(!submit)
    }, [submit, t] )
    
    const handleChange = name => event => { setUser({...user, [name]: event.target.value}) }
    const clickSubmit = () => {
        if (user.pass1 === user.pass2) {
            const [ error, passwordValidated ] = validatePassword(user.pass1)
            if (passwordValidated) {
                setSubmit(true)
                create(user)
                    .then(response => {
                        if (response.accepted) {
                            const emailSent = sendEmailLink('validateAccount', user, i18n.language)
                            if (emailSent) { setRedirect('/signin') } else { setRedirect(location.state.from) }
                        } else if (response.error) {
                            fireError(response.error.name, response.error.message)
                        } else {
                            fireError(t('popup.signup.failed.title'), t('popup.signup.failed.user'))
                        }
                        setSubmit(false) } )
                    .catch(error => fireError(error.name, error.message))
            } else fireError(error.name, error.message)
        } else fireError(t('popup.signup.failed.title'), t('popup.signup.failed.password'))
    }
    const renderRedirect = () => { 
        console.log("--- Signup component: Rich redirection to", redirect)
        //if (redirect !== '') { return <Redirect to={redirect}/> }
        if (cookies.session && cookies.session.user) { return <Redirect to={'/'}/> }
    }

    if (!loaded) return <><Loading /></>
    return <>
        {/* <Error title='Sign up error'
               name={sign.error.name}
               message={sign.error.message}
               open={sign.hasError} /> */}
        <Card id='sign'>
        {renderRedirect()}
            <Card.Header><h2><FontAwesomeIcon icon={faUserPlus} /> {t('signup.title')}</h2></Card.Header>
            <Card.Body>
                <Card.Title>{t('signup.header.title')}</Card.Title>
                <Card.Subtitle className='mb-2 text-muted'>{t('signup.header.intro')}</Card.Subtitle> 
                <Card.Text>{t('signup.header.description')}</Card.Text>
                <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>{t('signup.email.label')} </Form.Label>
                    <Form.Control type='email' placeholder={t('signup.email.placeholder')}
                                    defaultValue={user.email}
                                    onChange={handleChange('email')} />
                    <Form.Text className='text-muted'>{t('signup.email.helper')}</Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicText">
                    <Form.Label>{t('signup.username.label')}</Form.Label>
                    <Form.Control type='text' placeholder={t('signup.username.placeholder')} 
                                    defaultValue={user.username}
                                    onChange={handleChange('username')} />
                    <Form.Text className="text-muted">{t('signup.username.helper')}</Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>{t('signup.password.label')}</Form.Label>
                    <Form.Control type='password' placeholder={t('signup.password.placeholder')} 
                                    onChange={handleChange('pass1')}/>
                    <Form.Text className='text-muted'>{t('signup.password.helper')}</Form.Text>
                </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>{t('signup.password_repeat.label')} </Form.Label>
                        <Form.Control type='password' placeholder={t('signup.password_repeat.placeholder')} 
                                        onChange={handleChange('pass2')} />
                        <Form.Text className='text-muted'>{t('signup.password_repeat.helper')}</Form.Text>
                    </Form.Group>
                </Form>
            </Card.Body>
            <Card.Footer>
                <Card.Link>
                    <Button type='submit' onClick={clickSubmit}>
                        <FontAwesomeIcon icon={faUserPlus} /> {t('signup.button_submit')}
                    </Button>
                </Card.Link>
                <Card.Link href='/signin'>{t('signup.link.have_account')}</Card.Link>
            </Card.Footer>
        </Card>
    </>
}

export default SignUp
