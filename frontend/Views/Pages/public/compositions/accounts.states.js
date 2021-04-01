/* HOC for enhence states (hooks) to accounts.components Components */

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

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

export { statesAccountsManager }