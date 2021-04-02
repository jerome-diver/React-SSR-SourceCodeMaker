/* HOC for enhence states (hooks) to accounts.components Components */

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAuthenticate } from '../../../Controllers/context/authenticate'
import { date_formed, accountEnabled } from '../../helpers/config'
import { getGravatarUrl } from 'react-awesome-gravatar';

const statesAccountsManager = UI => {
    const states = (props) => {
        const { t } = useTranslation()
        const { open, submit, title, body } = useSelector(state => state.accounts.modal)
        const { error } = useSelector(state => state.accounts.componentStatus)
        const { canSubmit } = useSelector(state => state.accounts.modal)
        props = { ...props, open, submit, title, body,
                  error, canSubmit, t}
        return <UI {...props} />
    }
    return states
}

const statesModalBodyRole = UI => {
    const states = (props) => {
        const { existingRoles } = useSelector(state => state.accounts)
        const { content }       = useSelector(state => state.accounts.selectedAccount)
        props = { ...props, existingRoles, content}
        return <UI {...props} />
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

const statesAccount  = ({account}) => UI => {
    const states = (props) => {
        const { t }    = useTranslation()
        const [ avatarUrl, setAvatarUrl ]   = useState('')

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

export { statesAccountsManager, statesModalBodyRole, 
         statesModalBodySwitch, statesAccount }