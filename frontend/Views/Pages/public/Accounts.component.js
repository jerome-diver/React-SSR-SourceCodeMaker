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
import { actionsAccountsManager, actionsModalBodyRole,
         actionsModalBodySwitch, actionsAccount } from './compositions/accounts.actions'
import { statesAccountsManager, statesModalBodyRole,
         statesModalBodySwitch, actionsAccount } from './compositions/accounts.states'
import store from '../../../Redux/store'

const AccountsManagerUI = ({handleClose, submitFN, error, t, 
                            open, submit, title, body, canSubmit}) => {
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

const AccountsManager = actionsAccountsManager(statesAccountsManager(AccountsManagerUI))

const ModalBodyRoleUI = ({existingRoles, content, onRoleChange}) => {
    if (content.role) return ( 
        <Form.Group as={Col}>
            { existingRoles.map(role => { if (content.role.id != role.id) return (
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

const ModalBodyRole = actionsModalBodyRole(statesModalBodyRole(ModalBodyRoleUI))

const ModalBodySwitchUI = ({t, onModeChange, onEmailContent, modes }) => (
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

const ModalBodySwitch = actionsModalBodySwitch(statesModalBodySwitch(ModalBodySwitchUI))

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

const AccountUI = ({ account, t, selected, avatarUrl, editAccountRole, switchValidity }) => (
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

const Account = actionsAccount(statesAccount(AccountUI))

const Accounts = () => {
    const { t }                     = useTranslation()
    const [ accounts, setAccounts ] = useState([])    // list data from mongodb accounts server collection
    const selectedAccount           = useSelector(state => state.accounts.selectedAccount.content)
    const { loading }               = useSelector(state => state.accounts.componentStatus)
    const { getUser }               = useAuthenticate()
    const user = getUser()
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
            {accounts.map( account => { if (user.id == account.user.id) {
                return ( <Account key={account.user.id} 
                                  account={account}/> ) } } ) }
        </article>
    )
}

export default AccountsManager
