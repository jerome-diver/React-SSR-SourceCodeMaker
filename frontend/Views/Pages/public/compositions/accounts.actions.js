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

export { actionsAccountsManager }