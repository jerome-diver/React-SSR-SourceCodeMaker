/* Fetch Users CRUD actions */

import { cypher } from './user-form-helper'

const create = async (user) => {
    console.log("Create new user with default role")
    const newUser = { username: user.username,
                      email: user.email,
                      password: cypher(user.pass1) }
    try {
        let response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Accept': 'application/json',
                       'Content-Type': 'application/json' },
            body: JSON.stringify(newUser) } )
        return response.json()
    } catch(error) { return JSON.stringify({error}) }
}

const list = async (signal) => {
    try {
        let response = await fetch('/api/users/', {
            method: 'GET',
            credentials: 'include',
            signal: signal } )
        return response.json()
    } catch(error) { return JSON.stringify({error}) }
}

const read = async () => {
    try {
        const url = `/api/users/user`
        let response = await fetch(url, {
            method: 'GET',
            credentials: 'include' } )
        return response.json()
    } catch(error) { return JSON.stringify({error}) }
}

const update = async (user_form) => {
    try {
        let response = await fetch(`/api/users/`, {
            method: 'PUT',
            headers: { 'Accept': 'application/json',
                       'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({user_form}) } )
        return response.json()
    } catch(error) { return JSON.stringify({error}) }
}

const remove = async (params, credentials) => {
    try {
        let response = await fetch('/api/users/' + params.id, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Accept': 'application/json',
                       'Content-Type': 'application/json' } })
        return response.json()
    } catch(error) { return JSON.stringify({error}) }
}

const getRoleID = async (role_name) => {
    console.log("FETCH for Role with name:", role_name)
    try {
        const url = `/api/roles/${role_name}`
        let response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'}
        })
        return response.json()
    } catch (error) { return JSON.stringify({error}) }
}

/* POST request to validate account from link clicked after Validate.component process */
const updateAccount = async (token, ticket) => {
    try {
        const url = `/api/users/validate/account/${ticket}`
        let response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {  'Accept': 'application/json', 
                        'Content-Type': 'application/json',
                     },
            body: JSON.stringify({token: token})
        } )
        return response.json()
    } catch (error) { return{error: error} }
}

const updateEmail = async (ticket, new_email) => {
    try {
        let response = await fetch(`/api/users/modify/email/${ticket}`, { 
                    method: 'POST',
                    credential: 'include',
                    headers: { 'Accept': 'application/json',
                            'Content-Type': 'application/json' },
                    body: { newEmail: new_email } } )
        return response.json()
    } catch(error) { return JSON.stringify({error}) }
}

/* POST request to rich new password from link clicked after SetupPassword.component process */
const updatePassword = async (id, ticket, password) => {
    try {
        let response = await fetch(`/api/users/setup_password/${id}/${ticket}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({password: cypher(password)})
        } )
        return response.json()
    } catch (error) { return JSON.stringify({error}) }
}

export { create, list, read, update, remove, 
         getRoleID, 
         updateAccount, updateEmail, updatePassword }
