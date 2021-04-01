import React, { useState, useEffect } from 'react'
import { list, update } from '../../../Controllers/user/action-CRUD'
import { getRoles } from '../../../Controllers/roles/action-CRUD'
import { Modal, Badge, Card, Button, Col, Row, Form, FormCheck, OverlayTrigger, Popover } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useAuthenticate } from '../../../Controllers/context/authenticate'
import { Loading, Error } from './Printers.component'
import '../../../stylesheet/users.sass'
import { Calendar2Date } from 'react-bootstrap-icons'
import { date_formed, accountEnabled } from '../../helpers/config'
import { getGravatarUrl } from 'react-awesome-gravatar';
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedAccount, setSelectedAccountValidity, setValidityToUpdate,
         setExistingRoles, setRoleIdToUpdate,setEmailToSendContent,
         setEmailToSendSubject, setEmailToSendTo, setEmailToSendMode,
         setModal, setModalOpen, setModalCanSubmit,
         setError, setLoading } from '../../../Redux/Slices/accounts'
import store from '../../../Redux/store'

const AccountsManager = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { open, submit, title, body } = useSelector(state => state.accounts.modal)
    const { error } = useSelector(state => state.accounts.componentStatus)
    const { canSubmit } = useSelector(state => state.accounts.modal)

    const handleClose = () => { dispatch(setModalOpen(false)) }

    const update_account = (to_update) =>{
            update(to_update)
                .then(account => {
                    if (account.error) throw (account.error)
                    dispatch(setSelectedAccount(account))
                    })
                .catch(error =>  dispatch(setError(error)) )
                .finally(() =>   dispatch(setModalOpen(false)))
    }

    const submitFN = {
        submitRole: (e) => {
            e.preventDefault()
            const selectedAccount = store.getState().accounts.selectedAccount
            const to_update_user  = {...selectedAccount.content.user, 
                                     role_id: selectedAccount.toUpdate.roleId}
            update_account(to_update_user)
        },
        submitSwitch: (e) => {
            e.preventDefault()
            const selectedAccount = store.getState().accounts.selectedAccount
            const email_content   = store.getState().accounts.email
            const to_update_user  = {...selectedAccount.content.user,
                                     validated: !selectedAccount.content.user.validated}
            update_account(to_update_user)
        }
    }

    if (error.message) return (
         <Error title={t('error:accounts.list.failed')} 
                name={error.name} 
                message={error.message} /> )
    return (<>
        <Accounts />
        <Modal show={open}        size='lg'    onHide={handleClose} 
               backdrop="static"  centered >
            <Form onSubmit={ submitFN[submit] }>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {(body == 'body_roles') ? (<ModalBodyRole />) : (<ModalBodySwitch />) }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>{t('account.role.close')}</Button>
                <Button variant="primary" type='submit' disabled={!canSubmit}>{t('account.role.save')}</Button>
            </Modal.Footer>
            </Form>
        </Modal>
    </>)
}

const ModalBodyRole = () => {
    const dispatch = useDispatch()
    const roles    = store.getState().accounts.existingRoles
    const account  = store.getState().accounts.selectedAccount.content

    const onRoleChange = (e) => { 
        const role_id = e.target.value
        dispatch(setRoleIdToUpdate(role_id))
        dispatch(setModalCanSubmit(true))
    }

    if (account.role) return ( 
        <Form.Group as={Col}>
            { roles.map(role => { if (account.role.id != role.id) return (
                    <FormCheck key={role.id} id={'selectedRole' + role.id}>
                        <FormCheck.Input type='radio'        onChange={onRoleChange}
                                        name='roleSelected' value={role.id} />
                        <FormCheck.Label><Badge variant={role.color}>{role.name}</Badge></FormCheck.Label>
                        <Form.Text className='text-muted'>{role.description}</Form.Text>
                    </FormCheck>
                )
            })}
        </Form.Group>
    )
}

const ModalBodySwitch = () => {
    const { t }    = useTranslation()
    const dispatch = useDispatch()

    const onEmailContent = (e) => { 
        const content = e.target.value
        dispatch(setEmailToSendContent(content))
    }
    const onModeChange = (e) => {
        const mode = e.target.value
        dispatch(setEmailToSendMode(mode))
        dispatch(setModalCanSubmit(true))
    }
    const modes = [ {name: 'Warning',    color:'info'},
                    {name: 'Suspended',  color:'warning'},
                    {name: 'Banned',     color:'danger'},
                    {name: 'Own choice', color:'primary'},]
    return (
        <Form.Group as={Row}>
            <Form.Label>{t('account.switch_validity.label')}</Form.Label>
            <Form.Control as="textarea" rows={5} onChange={onEmailContent} />
            <div className='mr-4'>{t('account.switch_validity.reason')}</div>
            { modes.map((mode, index) => { return (
                    <FormCheck key={index} className='mr-4'>
                        <FormCheck.Input type='radio'        onChange={onModeChange}
                                         name='modeSelected' value={mode.name} />
                        <FormCheck.Label><Badge variant={mode.color}>{mode.name}</Badge></FormCheck.Label>
                    </FormCheck>
                )
            })}
        </Form.Group>
    )
}

const ActionLinks = ({ account }) => {
    const { t }                = useTranslation()
    const { getUser, getRole } = useAuthenticate()
    const user = getUser()
    const role = getRole()

    const deleteAccount = (account) => { 
        console.log("DELETE account:", account.user.username)
        /* Should:
            1/ open model form to add description reason text */

        /*  3/ remove user account concerned */

    }

    const sendEmailToUser = (account, content) => {
        /* Should:
            1/ open model form to add warn description */

        /*  2/ send email to user.email to warn him */

    }

    if (role && ((role.name == "Admin") || (user.id == account.user.id))) {
        return (<>
            <Button onClick={() => deleteAccount(account)} 
                    variant="danger"   size='sm'>
                { t('account.user.delete') }
            </Button>
        </> )
    } else return null
}

const Account = ({ account }) => {
    const { t }                         = useTranslation()
    const [ avatarUrl, setAvatarUrl ]   = useState('')
    const dispatch                      = useDispatch()
    const { getUser }                   = useAuthenticate()
    const user = getUser()

    const switchValidity = (account) => { 
        dispatch(setSelectedAccount(account))
        /*  1/ open modal form description reason text */
        const selectedAccount = store.getState().accounts.selectedAccount
        const username = (selectedAccount.content.user) ? selectedAccount.content.user.username : 'unknown'
        const modal = { 
            open:   true, 
            submit: 'submitSwitch', 
            title:  t('account.switch_validity.title') + ' ' +  username, 
            body:   'body_switch' }
        dispatch(setModal(modal))
        /*  2/ switch user account validity (!user.validated) */
        const valid = selectedAccount.validity.enabled
        const field_status = accountEnabled(!valid)
        dispatch(setSelectedAccountValidity(field_status))
    }

    const editAccountRole = (account) => {
        /* Define modal contents an open (for submit function, title and body content) */
        const username = (account.user) ? account.user.username : 'unknown'
        const title = t('account.role.edit.title') + ' ' + username
        const body = 'body_roles'
        const modal = { open: true, submit: 'submitRole', title, body }
        dispatch(setSelectedAccount(account))
        dispatch(setModal(modal)) // dispatch triggers.accounts.modal
    }

    useEffect(() => {
      const options = {size: 18, default: 'mp'}
      const gravatar = getGravatarUrl(account.user.email, options)
      setAvatarUrl(gravatar)
    }, [account.user])

    if (user.id == account.user.id) return null
    else {
        const selected = accountEnabled(account.user.validated)
        return (
            <Card id={account.user.id} className='mt-2'>
                <Card.Header className='d-flex align-items-center justify-content-between' 
                             style={{ backgroundColor: 'rgb(25,25,25,0.75)' }}>
                    <div className='d-flex'>
                        <img src={avatarUrl} className='mr-2'/>
                        <h4 className='ml-2'>{account.user.username}</h4>
                    </div>
                    <Button variant={`outline-${account.role.color}`}
                            size='sm'
                            onClick={() => editAccountRole(account)} >
                        {account.role.name}
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Card.Title>{t('account.title1')}</Card.Title>
                    <Card.Text as='div'>
                        <table>
                            <tbody> 
                                <tr>
                                    <td style={{fontSize: 'smaller',
                                                color: 'rgb(150,150,150)'}}
                                        className='mr-4'>
                                        {t('profile.email.label')}:
                                    </td>
                                    <td><b>{account.user.email}</b></td>
                                </tr>
                                <tr>
                                    <td style={{fontSize: 'smaller',
                                                color: 'rgb(150,150,150)'}}
                                        className='mr-4'>
                                        {t('profile.first_name.label')}:
                                    </td>
                                    <td><b>{account.user.first_name}</b></td>
                                </tr>
                                <tr>
                                    <td style={{fontSize: 'smaller',
                                                color: 'rgb(150,150,150)'}}
                                        className='mr-4'>
                                        {t('profile.second_name.label')}:
                                    </td>
                                    <td><b>{account.user.second_name}</b></td>
                                </tr>
                            </tbody>
                        </table>
                    </Card.Text>
                    <Card.Title className='my-2'>{t('account.title2')}</Card.Title>
                    <Card.Text as='div'>
                        <p style={{ color: 'orange'}}>
                            <Calendar2Date className='mr-2' color='orange'/>
                            {t('account.created', {date: date_formed(new Date(account.user.created))})}
                        </p>
                        <OverlayTrigger placement='right'
                                        overlay={
                                            <Popover id='popover-positioned-right'>
                                                <Popover.Title as="h3">
                                                    {t('account.user.status.popover.title')}
                                                </Popover.Title>
                                                <Popover.Content>
                                                    {t('account.user.switch',
                                                    {action: selected.enabled})}
                                                </Popover.Content>
                                            </Popover> }>
                            <Button variant={`outline-${selected.color}`}
                                    size='sm'
                                    onClick={() => switchValidity(account)}>
                                {selected.status}
                            </Button>
                        </OverlayTrigger>
                    </Card.Text>
                </Card.Body>
                <Card.Footer className='d-flex justify-content-end'
                             style={{ backgroundColor: 'rgb(25,25,25,0.75)' }}>
                    <ActionLinks account={account}/>
                </Card.Footer>
            </Card>
        )
    }
}

const Accounts = () => {
    const { t }                     = useTranslation()
    const [ accounts, setAccounts ] = useState([])    // list data from mongodb accounts server collection
    const selectedAccount           = useSelector(state => state.accounts.selectedAccount.content)
    const { loading }               = useSelector(state => state.accounts.componentStatus)
    const dispatch                  = useDispatch()
  
    useEffect( () => {
        const abort = new AbortController()     // stop to fetch a request if we cancel this page
        const myUsers = list(abort.signal)
        const myRoles = getRoles(abort.signal)
        Promise.all([myUsers, myRoles])
            .then(results => {
                setAccounts(results[0])
                dispatch(setExistingRoles(results[1])) })
            .catch(error => dispatch(setError(error)))
            .finally(() =>  {
                const isLoading = false
                dispatch(setLoading(isLoading)) })
        return function cleanup() { abort.abort() }
    }, [selectedAccount] )
  
    if (loading) return (<Loading />)
    return (
        <article id='accounts'>
            {accounts.map( account => { 
                return ( <Account key={account.user.id} 
                                  account={account}/> ) } ) }
        </article>
    )
}

export default AccountsManager
