import React, { useEffect, useState, Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuthenticated, useAuthenticate } from '../../../Controllers/context/authenticate'
import { Loading, Error } from '../../Pages/public/Printers.component'
import { useTranslation } from 'react-i18next'

const  PrivateRoute = ({component: Component, ...rest}) => {

    const { authority } = rest
    console.log("--- PrivateRoute component: For authority role props:{ authority } access is:", authority)

    const { t } = useTranslation()
    const [ access, setAccess ] = useState(false)
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState({})
    //const [ redirect, setRedirect ] = useState('')
    const { getUser } = useAuthenticate()

    useEffect(() => {
        const user = getUser()
        console.log("--- PrivateRoute component useEffect entry point")
        if (!user) setError({error: { name: "No access authorized",
                                      message: 'Undefined user, you need to be logged in.'}})
        isAuthenticated()
            .then(response => {
                if (response.error) throw (response.error)
                setAccess(response.authenticated) }) 
            .catch(error => setError(error) )
            .finally(() => setLoading(false))
    }, [])

    //const goHome = () => { setRedirect('/'); }

    if (loading) { return <Loading /> }
    if (error.name) return (
         <Error title={t('error:private_route.failed')} 
                name={error.name} 
                message={error.message} /> )
    console.log("--- PrivateRoute component gain access ?", access)
    return (
        <Route {...rest} render={ 
            (props) => (access) ? 
                    ( <Component {...props} /> ) :
                    ( <Redirect to={{ pathname: '/signin', 
                                        state: { from: props.location, 
                                                 error: 'Failed to authenticate Token'} }} /> )
        } /> )
}

export default PrivateRoute
