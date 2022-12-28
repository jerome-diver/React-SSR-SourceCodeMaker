import React, { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { isAuthenticated, useAuthenticate } from '../../../Controllers/context/authenticate'

const PrivateRoutes = ({restricted = ''}) => {

    console.log("--- PrivateRoutes Component for logged user")

    const [ access, setAccess ] = useState(false)
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState({})
    const { getUser, getRole } = useAuthenticate()

    useEffect(() => {
        const user = getUser()
        const role = getRole()
        console.log("--- PrivateRoutes useEffect entry point for user: %s, and role: %s", user.name, role.name)
        if (!user) setError({error: { name: "No access authorized",
                                      message: 'Undefined user, you need to be logged in.'}})
        else isAuthenticated()
            .then(response => {
                if (response.error) throw (response.error)
                console.log("ROLE.NAME = %s, RESTRICTED = %s", role.name, restricted)
                if (restricted !== '') { setAccess(response.authenticated && (role.name === restricted)) } 
                else { setAccess(response.authenticated) }
                console.log("Define (access) = ", access) 
            })
            .catch(err => setError( {error: err}) )
            .finally(() => setLoading(false))
    }, [getUser, getRole, restricted, access])

    return (access) ? <Outlet /> : <Navigate to="/signin" />
}

export default PrivateRoutes
