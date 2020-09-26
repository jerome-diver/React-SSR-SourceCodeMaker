import React, { useEffect, useState } from 'react'
import { Spinner, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

const Loading = (props) => {
    const { i18n, t } = useTranslation()

    useEffect( () => {
        const lang = i18n.language || 'en'
        console.log("--- Loading get language:", lang)
    }, [i18n.language] )

    return (
        <>
            <Alert variant='info'>
                <Spinner animation='border' role='status'/>
                <p>{t('general.loading')}</p>
            </Alert>
        </>
    )
    }

export default Loading

