/* Slice Redux for Accounts component */

import { createSlice } from '@reduxjs/toolkit'

export  const accountsSlice = createSlice({
    name: "accounts",
    initialState: {
        componentStatus: {
            loading: true,
            error: {
                name: undefined,
                message: undefined
            }
        },
        selectedAccount: {
            content: {}, // will be the account (user and role) object
            validity: {
                status: '',
                color: '',
                enabled: false
            },
            toUpdate: {
                roleId: '',
                enabled: undefined
            },
        },
        existingRoles: [],
        modal: {
            open: false,
            submit: {},
            title: '',
            body: ''
        },
        email: {
            mode: 'contact', // any in ['contact', 'warning', 'banned', 'suspended']
            subject: '',
            content: '',
            to: ''
        }
    },
    reducers: {
        setLoading: (state, action) => { state.componentStatus.loading = action.payload },
        setError: (state, action) => { state.componentStatus.error = action.payload },
        setSelectedAccount: (state, action) => { state.selectedAccount.content = action.payload },
        setSelectedAccountValidity: (state, action) => { state.selectedAccount.validity = action.payload },
        setRoleIdToUpdate: (state, action) => { state.selectedAccount.toUpdate.roleId = action.payload },
        setValidityToUpdate: (state, action) => { state.selectedAccount.toUpdate.enabled = action.payload },
        setExistingRoles: (state, action) => { state.existingRoles = action.payload },
        setModal: (state, action) => { state.modal = action.payload },
        setModalOpen: (state, action) => { state.modal.open = action.payload },
        setEmailToSend: (state, action) => { state.email = action.payload },
        setEmailToSendContent: (state, action) => { state.email.content = action.payload },
    }
})

const { actions, reducer } = accountsSlice

export const { setLoading, setError,
    setEmailToSend, setExistingRoles, setModalOpen, getSelectedAccountContent,
    getModalBody, getModalTitle, getModalSubmit, getModalOpen,
    setRoleIdToUpdate, setSelectedAccount, setValidityToUpdate,
    setModal, setSelectedAccountValidity, setEmailToSendContent,
    getModal, getEmail, getExistingRoles, getSelectedAccount,
    setApplyUpdateRoleId, setApplyUpdateValidity } = actions


export default reducer