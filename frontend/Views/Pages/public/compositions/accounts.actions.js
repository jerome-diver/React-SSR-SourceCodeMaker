/* HOC to Compose with Accounts.component for ACTIONS */

import React from 'react'
import { list, update } from '../../../../Controllers/user/action-CRUD'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { accountEnabled } from '../../../helpers/config'
import store from '../../../../Redux/store'
import { setSelectedAccount, setSelectedAccountValidity, setValidityToUpdate,
         setExistingRoles, setRoleIdToUpdate,setEmailToSendContent,
         setEmailToSendSubject, setEmailToSendTo, setEmailToSendMode,
         setModal, setModalOpen, setModalCanSubmit,
         setError, setLoading } from '../../../../Redux/Slices/accounts'
import { sendEmailLink } from '../../../../Controllers/user/user-form-helper'

const actionsAccountsManager = UI => {
    const actions = (props) => {
        const dispatch = useDispatch()
        const { i18n } = useTranslation()
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
                const email           = store.getState().accounts.email
                const to_update_user  = {...selectedAccount.content.user,
                                        validated: !selectedAccount.content.user.validated}
                update_account(to_update_user)
            },
            submitContact: (e) => {
                const selectedAccount = store.getState().accounts.selectedAccount.content
                const email           = store.getState().accounts.email
                const data = { id: selectedAccount.user.id,
                               content: email.content,
                               subject: email.subject }
                sendEmailLink('contact', data, i18n.language)
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

const actionsModalBodyEmailContact = UI => {
    const actions = (props) => {
        const dispatch = useDispatch()
        const onEmailContent = (e) => {
            const content = e.target.value
            dispatch(setEmailToSendContent(content))
            dispatch(setModalCanSubmit(true))
        }
        const onEmailSubject = (e) => {
            const subject = e.target.value
            dispatch(setEmailToSendSubject(subject))
            dispatch(setModalCanSubmit(true))
        }
        props = {...props, onEmailContent, onEmailSubject}
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
        props = {...props, onModeChange, onEmailContent}
        return <UI {...props} />
    }
    return actions
}

const actionsActionLinks = UI => {
    const actions = (props) => {
        const { t } = useTranslation()
        const dispatch = useDispatch()
        const deleteAccount = (account) => {
            console.log("DELETE account:", account.user.username)
            /* Should:
                1/ open model form to add description reason text */

            /*  3/ remove user account concerned */

        }
        const sendEmailToUser = (account, content) => {
            /* Should:
                1/ open model form to add warn description */
            const username = (account.user) ? account.user.username : 'unknown'
            const title = t('mailer:account.user.contact.title', {username})
            const body = 'body_contact'
            const modal = { open: true, submit: 'submitContact', title, body }
            dispatch(setSelectedAccount(account))
            dispatch(setModal(modal)) // dispatch triggers.accounts.modal
        }
        props = {...props, deleteAccount, sendEmailToUser}
        return <UI {...props} />
    }
    return actions
}

const actionsAccount =  UI => {
    const actions = (props) => {
        const dispatch = useDispatch()
        const { t }    = useTranslation()
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

const actionsAccounts = UI => {
    const actions = (props) => {
        const dispatch = useDispatch()
        props = {...props, }
        return <UI {...props} />
    }
    return actions
}

export { actionsAccountsManager, actionsModalBodyRole, 
         actionsModalBodySwitch, actionsActionLinks,
         actionsModalBodyEmailContact,
         actionsAccount, actionsAccounts }
