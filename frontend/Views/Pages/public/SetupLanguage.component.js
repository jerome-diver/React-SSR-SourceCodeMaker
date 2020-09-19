import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useLocation, useParams } from 'react-router'
import { Spinner, Alert } from 'react-bootstrap'
import { useCookies } from 'react-cookie'

const SetupLanguage = (props) => {
    const [load, setLoad] = useState(false)
    const location = useLocation()
    const [ cookies, setCookies, removeCookies ] = useCookies(['session'])
    const { lang } = useParams()
    console.log("---SetupLanguage selected", lang)

    useEffect(() => {

    }, [])

    if (load) {
        return (<>
            <Redirect to={location.state.from}/>
        </>)
    } else {
        return (<>
            <Alert variant='info'>
                <Spinner animation='border' role='status'/>
                <p>Loading...</p>
            </Alert>
        </>)
    }
}

export default SetupLanguage
