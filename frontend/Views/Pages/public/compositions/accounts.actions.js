/* Compose with Accounts.component for ACTIONS */

import React from 'react'
import { list, update } from '../../../../Controllers/user/action-CRUD'
import { useDispatch } from 'react-redux'
import store from '../../../../Redux/store'
import { setSelectedAccount, setSelectedAccountValidity, setValidityToUpdate,
         setExistingRoles, setRoleIdToUpdate,setEmailToSendContent,
         setEmailToSendSubject, setEmailToSendTo, setEmailToSendMode,
         setModal, setModalOpen, setModalCanSubmit,
         setError, setLoading } from '../../../../Redux/Slices/accounts'

const actionsAccountsManager = UI => {
    const actions = (props) => {
        const dispatch = useDispatch()
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
        props = { ...props, handleClose, submitFN }
        return <UI {...props} />
    }
    return actions
}

const actionsModalBodyRole = UI => {
    const actions = (props) => {
        const dispatch = useDispatch()
        const onRoleChange = (e) => {
            const role_id = e.target.value
            dispatch(setRoleIdToUpdate(role_id))
            dispatch(setModalCanSubmit(true))
        }
        props = {...props, onRoleChange}
        return <UI {...props} />
    }
    return actions
}

const actionsModalBodySwitch = UI => {
    const actions = (props) => {
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
        props = {...props, onModeChange, onEmailContent, modes}
        return <UI {...props} />
    }
    return actions
}

const actionsAccount =  UI => {
    const actions = (props) => {
        const dispatch = useDispatch()
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
        props = {...props, switchValidity, editAccountRole}
        return <UI {...props} />
    }
    return actions
}


export { actionsAccountsManager, actionsModalBodyRole, 
         actionsModalBodySwitch, actionsAccount }