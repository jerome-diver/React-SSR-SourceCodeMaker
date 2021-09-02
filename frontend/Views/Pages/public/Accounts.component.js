import React from 'react'
import { Modal, Badge, Card, Button, Col, Row, Form, FormCheck, OverlayTrigger, Popover } from 'react-bootstrap'
import '../../../stylesheet/users.sass'
import { Calendar2Date } from 'react-bootstrap-icons'
import { date_formed } from '../../helpers/config'
import { actionsAccountsManager, actionsModalBodyRole,
         actionsModalBodySwitch, actionsActionLinks,
         actionsModalBodyEmailContact,
         actionsAccount, actionsAccounts } from './compositions/accounts.actions'
import { statesAccountsManager, statesModalBodyRole,
         statesModalBodySwitch, statesActionLinks,
         statesModalBodyEmailContact,
         statesAccount, statesAccounts } from './compositions/accounts.states'

/* Pure UI components with HOC to compose with states and actions components.
   -> AccountsManager is the Main composed component
   -> Accounts show a Modal and the list of
   -> Account,  who show
   -> ActionLinks in his Card.Footer 
   On click event, Modal Content (Body, Title, submit method) are updated with on of:
   -> ModalBodyRole or
   -> ModalBodyEmailContact
   -> ModalBodySwitch */ 

const renderSwitch = (param) => {
    switch (param) {
        case 'body_roles': 
            return (<ModalBodyRole />)
        case 'body_switch':
            return (<ModalBodySwitch />)
        case 'body_contact':
            return (<ModalBodyEmailContact />)
    }
}

const AccountsManagerUI = ({handleClose, submitFN, t,
                            open, submit, title, body, canSubmit}) => (
     <>
        <Accounts />
        <Modal show={open}        size='lg'    onHide={handleClose} 
                backdrop="static"  centered >
            <Form onSubmit={ submitFN[submit] }>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{ renderSwitch(body) }</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>{t('account.role.close')}</Button>
                <Button variant="primary" type='submit' disabled={!canSubmit}>{t('account.role.save')}</Button>
            </Modal.Footer>
            </Form>
        </Modal>
    </>
)

const ModalBodyRoleUI = ({existingRoles, content, onRoleChange}) => (
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

const ModalBodyEmailContactUI = ({t, onEmailContent, onEmailSubject}) => (
    <Form.Group as={Col}>
      <Form.Label>{t('mailer:account.user.contact.label.subject')}</Form.Label>
      <Form.Control as="textarea" rows={5} onChange={onEmailSubject} />
      <Form.Label>{t('mailer:account.user.contact.label.content')}</Form.Label>
      <Form.Control as="textarea" rows={5} onChange={onEmailContent} />
    </Form.Group>
)

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

const ActionLinksUI = ({ account, t, deleteAccount, sendEmailToUser }) => (
    <>
        <Button onClick={() => sendEmailToUser(account)} variant='info' size='sm' className='mr-2'>
            {t('account.user.contact')}
        </Button>
        <Button onClick={() => deleteAccount(account)} variant="danger" size='sm'>
            {t('account.user.delete')}
        </Button>
    </>
)

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

const AccountsUI = ({accounts, user}) => (
    <article id='accounts'>
        {accounts.map( account => { if (user.id != account.user.id) {
            return ( <Account key={account.user.id} account={account}/> ) } } ) }
    </article>
)

/* Compose UI with actions and states to provide each Component */

const AccountsManager = actionsAccountsManager(statesAccountsManager(AccountsManagerUI))
const ModalBodyRole = actionsModalBodyRole(statesModalBodyRole(ModalBodyRoleUI))
const ModalBodyEmailContact = actionsModalBodyEmailContact(statesModalBodyEmailContact(ModalBodyEmailContactUI))
const ModalBodySwitch = actionsModalBodySwitch(statesModalBodySwitch(ModalBodySwitchUI))
const ActionLinks = actionsActionLinks(statesActionLinks(ActionLinksUI))
const Account = actionsAccount(statesAccount(AccountUI))
const Accounts = actionsAccounts(statesAccounts(AccountsUI))

export default AccountsManager
