import React, { useState, useEffect } from 'react'
import { list, update } from '../../../Controllers/user/action-CRUD'
import { getRoles } from '../../../Controllers/roles/action-CRUD'
import { Modal, Badge, Card, Button, Col, Form, FormCheck, OverlayTrigger, Popover } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useAuthenticate, canModify } from '../../../Controllers/context/authenticate'
import { Loading, Error } from './Printers.component'
import '../../../stylesheet/users.sass'
import { Calendar2Date } from 'react-bootstrap-icons'
import { date_formed, accountEnabled } from '../../helpers/config'
import { getGravatarUrl } from 'react-awesome-gravatar';
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedAccount, setEmailToSendContent,
         setExistingRoles, setApplyUpdateValidity,
         setRoleIdToUpdate, setSelectedAccountValidity, 
         setModal, setModalOpen,
         setError, setLoading } from '../../../Redux/Slices/accounts'
import store from '../../../Redux/store'

const AccountsManager = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { open, submit, title, body } = useSelector(state => state.accounts.modal)
    const { loading, error } = useSelector(state => state.accounts.componentStatus)

    const handleClose = () => { 
        dispatch(setModalOpen(false))
        dispatch(setApplyUpdateValidity(false))
    }

    const submitFN = {
        submitRole: (e) => {
            e.preventDefault()
            const selectedAccount = store.getState().accounts.selectedAccount
            console.log("Update this account user: %s, with role_id: %s", 
                        selectedAccount.content.user.username, selectedAccount.toUpdate.RoleId)
            const to_update_user = {...selectedAccount.content.user, 
                                    role_id: selectedAccount.toUpdate.roleId}
            update(to_update_user)
                .then(account => {
                    if (account.error) throw (account.error)
                    dispatch(setSelectedAccount(account))
                    })
                .catch(error =>  dispatch(setError(error)) )
                .finally(() =>   dispatch(setModalOpen(false)))
        },
        submitSwitch: (e) => {

        }
    }

    if (error.message) return (
         <Error title={t('error:accounts.list.failed')} 
                name={error.name} 
                message={error.message} /> )
    return (<>
        <Accounts />
        <Modal show={open}
               size='lg'
               onHide={handleClose}
               backdrop="static"
               centered >
            <Form onSubmit={ submitFN[submit] }>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group as={Col}>
                    {(body == 'body_roles') ? (<ModalBodyRole />) : (<ModalBodySwitch />) }
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>{t('account.role.close')}</Button>
                <Button variant="primary" type='submit'>{t('account.role.save')}</Button>
            </Modal.Footer>
            </Form>
        </Modal>
    </>)
}

const ActionLinks = ({ account }) => {
    const { t } = useTranslation()
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
                    variant="danger"
                    size='sm'>
                { t('account.user.delete') }
            </Button>
        </> )
    } else return null
}

const ModalBodyRole = () => {
    const dispatch = useDispatch()
    const roles = store.getState().accounts.existingRoles
    const account = store.getState().accounts.selectedAccount.content

    const onRoleChange = (e) => { 
        const role_id = e.target.value
        dispatch(setRoleIdToUpdate(role_id))
    }

    return ( <>
        { roles.map(role => { 
            return (
                <FormCheck key={role.id} id={'selectedRole' + role.id}>
                    <FormCheck.Input isValid={(account.role) ? (account.role.id == role.id) 
                                                            : false}
                                    type='radio'
                                    name='roleSelected'
                                    value={role.id}
                                    onChange={onRoleChange} />
                    <FormCheck.Label>{role.name}</FormCheck.Label>
                    <Form.Text className='text-muted'>{role.description}</Form.Text>
                </FormCheck>
            )
        })}
    </>)
}

const ModalBodySwitch = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const onEmailContent = (e) => { 
        const content = e.target.value
        dispatch(setEmailToSendContent(content))
    }

    return (<>
        <Form.Label>{t('account.switch_validity.label')}</Form.Label>
        <Form.Control as="textarea" rows={5} onChange={onEmailContent} />
    </>)
}

const Account = ({ account }) => {
    const { t } = useTranslation()
    const [ avatarUrl, setAvatarUrl ] = useState('')
    const { getUser } = useAuthenticate()
    const user = getUser()
    const dispatch = useDispatch()

    const switchValidity = (account) => { 
        dispatch(setSelectedAccount(account))
        /* should:
            1/ open modal form description reason text */
        const selectedAccount = store.getState().accounts.selectedAccount.content
        const username = (selectedAccount.user) ? selectedAccount.user.username : 'unknown'
        const title = t('account.switch_validity.title') + ' ' +  username
        const body = 'body_switch'
        const modal = { open: true, submit: 'submitSwitch', title, body }
        dispatch(setModal(modal)) // dispatch triggers.accounts.modal
        /*  2/ switch user account validity (!user.validated) */
        const valid = store.getState().accounts.selectedAccount.validity.enabled
        const field_status = accountEnabled(!valid)
        dispatch(setSelectedAccountValidity(field_status))
    }

    const editAccountRole = (account) => {
        console.log("Role is:", account.role.name)
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
        const selected = accountEnabled(account.enabled)
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
                                <td>{t('profile.email.label')}:</td>
                                <td>{account.user.email}</td>
                            </tr>
                            <tr>
                                <td>{t('profile.first_name.label')}:</td>
                                <td>{account.user.first_name}</td>
                            </tr>
                            <tr>
                                <td>{t('profile.second_name.label')}:</td>
                                <td>{account.user.second_name}</td>
                            </tr>
                        </tbody>
                    </table>
                </Card.Text>
                <Card.Title className='my-2'>{t('account.title2')}</Card.Title>
                <Card.Text as='div'>
                    <p style={{ color: 'orange'}}><Calendar2Date className='mr-2' color='orange'/>
                        {t('account.created', {date: date_formed(new Date(account.user.created))})}</p>
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
                <Card.Link className='d-flex justify-content-end'>
                    <ActionLinks account={account}/>
                </Card.Link>
            </Card.Body>
            </Card>
        )
    }
}

const Accounts = () => {
    const { t } = useTranslation()
    const [ accounts, setAccounts ]               = useState([])    // list data from mongodb accounts server collection
    const selectedAccount = useSelector(state => state.accounts.selectedAccount.content)
    const { loading } = useSelector(state => state.accounts.componentStatus)
    const dispatch = useDispatch()
  
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
                return ( <Account key={account.user.id} account={account}/> ) } ) }
        </article>
    )
}

export default AccountsManager
