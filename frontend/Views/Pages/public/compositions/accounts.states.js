/* HOC for enhence states (hooks) to accounts.components Components */

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useAuthenticate } from '../../../../Controllers/context/authenticate'
import { accountEnabled } from '../../../helpers/config'
import { getGravatarUrl } from 'react-awesome-gravatar';
import { Error, Loading } from '../Printers.component'
import { list } from '../../../../Controllers/user/action-CRUD'
import { getRoles } from '../../../../Controllers/roles/action-CRUD'
import { setExistingRoles, setError, setLoading } from '../../../../Redux/Slices/accounts'

const statesAccountsManager = UI => {
    const states = (props) => {
        const { t } = useTranslation()
        const { open, submit, title, body } = useSelector(state => state.accounts.modal)
        const { error } = useSelector(state => state.accounts.componentStatus)
        const { canSubmit } = useSelector(state => state.accounts.modal)
        props = { ...props, open, submit, title, body,
                  canSubmit, t}
        if (error.message) return (
            <Error title={t('error:accounts.list.failed')} 
                    name={error.name} 
                    message={error.message} /> )
        return <UI {...props} />
    }
    return states
}

const statesModalBodyRole = UI => {
    const states = (props) => {
        const { existingRoles } = useSelector(state => state.accounts)
        const { content }       = useSelector(state => state.accounts.selectedAccount)
        props = { ...props, existingRoles, content}
        if (content.role) return ( <UI {...props} /> )
        return null
    }
    return states
}

const statesModalBodySwitch  = UI => {
    const states = (props) => {
        const { t }    = useTranslation()
        props = {...props, t}
        return <UI {...props} />
    }
    return states
}

const statesActionLinks  = UI => {
    const states = (props) => {
        const { t }    = useTranslation()
        const { getUser, getRole } = useAuthenticate()
        const user = getUser()
        const role = getRole()
        const { account } = props
        props = {...props, account, t}
        if (role && ((role.name == "Admin") || (user.id == account.user.id))) {
            return <UI {...props} />
        } else return null
    }
    return states
}

const statesAccount  = UI => {
    const states = (props) => {
        const { t }    = useTranslation()
        const [ avatarUrl, setAvatarUrl ]   = useState('')
        const { account } = props

        useEffect(() => {
            const options = {size: 18, default: 'mp'}
            const gravatar = getGravatarUrl(account.user.email, options)
            setAvatarUrl(gravatar)
        }, [account.user])

        const selected = accountEnabled(account.user.validated)
        props = {...props, account, t, avatarUrl, selected}
        return <UI {...props} />
    }
    return states
}

const statesAccounts  = UI => {
    const states = (props) => {
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
  
        props = {...props, t, accounts, user}
        if (loading) return (<Loading />)
        return <UI {...props} />
    }
    return states
}

export { statesAccountsManager, statesModalBodyRole, 
         statesModalBodySwitch, statesActionLinks,
         statesAccount, statesAccounts }