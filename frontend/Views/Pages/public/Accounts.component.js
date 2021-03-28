import React, { useState, useEffect } from 'react'
import { list, update } from '../../../Controllers/user/action-CRUD'
import { getRoles } from '../../../Controllers/roles/action-CRUD'
import { Jumbotron, Modal, Badge, Card, Button, Row, Col, Form, FormCheck } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useAuthenticate, canModify } from '../../../Controllers/context/authenticate'
import { Loading, Error } from './Printers.component'
import '../../../stylesheet/users.sass'
import { Calendar2Date } from 'react-bootstrap-icons'
import { date_formed, accountEnabled } from '../../helpers/config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getGravatarUrl } from 'react-awesome-gravatar';

const editAccountRole = (account, setAccount, setEditRole) => {
    console.log("Role is:", account.role.name)
    setAccount(account)
    setEditRole(true)
}

const switchValidity = (account, validity, setValidity) => { 
    console.log("Edit")
    setValidity(!validity)
}

const deleteAccount = (account) => { console.log("DELETE account:", account.user.username) }

const ActionLinks = ({ account }) => {
    const { t } = useTranslation()
    const [ validity, setValidity ] = useState(!account.user.validated)
    const { getUser, getRole } = useAuthenticate()
    const user = getUser()
    const role = getRole()
    if (role && ((role.name == "Admin") || (user.id == account.user.id))) {
        return (<>
            <Button onClick={() => switchValidity(account, validity, setValidity)} 
                    variant="warning"
                    className='mr-2'
                    size='sm'>
                { t('account.user.switch', {action: validity}) }
            </Button>
            <Button onClick={() => deleteAccount(account)} 
                    variant="danger"
                    size='sm'>
                { t('account.user.delete') }
            </Button>
        </> )
    } else return null
}

const Account = ({ account, setAccount, setEditRole }) => {
    const { t } = useTranslation()
    const [ avatarUrl, setAvatarUrl ] = useState('')
    const accountStatus = accountEnabled(account.user.validated)
    const { getUser } = useAuthenticate()
    const user = getUser()

    useEffect(() => {
      const options = {size: 18, default: 'mp'}
      const gravatar = getGravatarUrl(account.user.email, options)
      setAvatarUrl(gravatar)
    }, [account.user])

    if (user.id == account.user.id) return null
    else {
        return (
            <Card id={account.user.id} className='mt-2'>
                <Card.Header className='d-flex align-items-center justify-content-between' 
                            style={{ backgroundColor: 'rgb(25,25,25,0.75)' }}>
                    <div className='d-flex'>
                        <img src={avatarUrl} className='mr-2'/>
                        <h4 className='ml-2'>{account.user.username}</h4>
                    </div>
                    <Button variant={`outline-${account.role.color}`}
                            onClick={() => editAccountRole(account, setAccount, setEditRole)}
                            size='sm'>
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
                    <p>{t('account.status')} : <Badge variant={accountStatus.color}>{accountStatus.status}</Badge></p>
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
    const [ accounts, setAccounts ]             = useState([])    // list data from mongodb accounts server collection
    const [ selectedAccount, setAccount ]       = useState({})    // Account selected to edit
    const [ loading, setLoading ]               = useState(true)  // false: not loading, true: loading
    const [ error, setError ]                   = useState('')    // error loading accounts report text
    const [ editRole, setEditRole ]             = useState(false) // open Modal to edit Role with account
    const [ existingRoles, setExistingRoles ]   = useState([])    // Existing roles list
    const [ selectedRoleID, setSelectedRoleID ] = useState('')    // Role_id selected
  
    const handleClose = () => { setEditRole(false) }
    const submitRole = (e) => {
        e.preventDefault()
        console.log("Update this account user: %s, with role_id: %s", 
                    selectedAccount.user.username, selectedRoleID)
        const to_update_user = {...selectedAccount.user, role_id: selectedRoleID}
        update(to_update_user)
            .then(account => {
                if (account.error) throw (account.error)
                setAccount(account) })
            .catch(error =>  setError(error) )
            .finally(() =>   setEditRole(false))
    }
    const onRoleChange = (e) => { setSelectedRoleID(e.target.value) }

    useEffect( () => {
        const abort = new AbortController()     // stop to fetch a request if we cancel this page
        const myUsers = list(abort.signal)
        const myRoles = getRoles(abort.signal)
        Promise.all([myUsers, myRoles])
            .then(results => { setAccounts(results[0]); setExistingRoles(results[1]); })
            .catch(error => setError(error))
            .finally(() =>  setLoading(false))
        return function cleanup() { abort.abort() }
    }, [selectedAccount] )
  
    if (loading) { return <Loading /> }
    if (error.message) return (
         <Error title={t('error:accounts.list.failed')} 
                name={error.name} 
                message={error.message} /> )
    return (<>
        <article id='accounts'>
            {accounts.map( (account, index) => { 
                return ( <Account account={account}
                                    setAccount={setAccount}
                                    key={index} 
                                    setEditRole={setEditRole}/> ) } ) }
        </article>
        <Modal show={editRole}
               size='lg'
               onHide={handleClose}
               backdrop="static"
               centered >
            <Form onSubmit={submitRole}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {t('account.role.edit.title')} {(selectedAccount.user) ? selectedAccount.user.username 
                                                                            : 'unknown'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group as={Col}>
                    {existingRoles.map((role, index) => {
                        return (
                        <FormCheck key={index} id={'selectedRole' + index}>
                            <FormCheck.Input isValid={(selectedAccount.role) ? (selectedAccount.role.id == role.id) 
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

export default Accounts
