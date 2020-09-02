import { cypher } from './user-form-helper'
import { get } from 'mongoose'

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
    } catch(error) { return { error: error }}
}

const validateAccount = async (username) => {
    console.log("Start to send email with validation link inside for ", username)
    let response = await fetch(`/api/validate`, {
        method: 'POST',
        headers: { 'Accept': 'application/json',
                   'Content-Type': 'application/json' },
        body: JSON.stringify( {username: username} ) } )
    return response.json() 
}

const list = async (signal) => {
    try {
        let response = await fetch('/api/users/', {
            method: 'GET',
            signal: signal } )
        return await response.json()
    } catch(error) { console.log('Failed to show users list: ' + error) }
}

const read = async () => {
    try {
        const url = `/api/users/user`
        let response = await fetch(url, {
            method: 'GET',
            credentials: 'include' } )
        return await response.json()
    } catch(error) { console.log('Failed to show user: ' + error) }
}

const update = async (params, credentials, user) => {
    try {
        let response = await fetch('/api/users/' + params.id, {
            method: 'PUT',
            headers: { 'Accept': 'application/json',
                       'Content-Type': 'application/json',
                       'Authorization': 'Bearer ' + credentials.t },
            body: JSON.stringify(user) } )
        return await response.json()
    } catch(error) { console.log('Failed to update user: ' + error) }
}

const remove = async (params, credentials) => {
    try {
        let response = await fetch('/api/users/' + params.id, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json',
                       'Content-Type': 'application/json',
                       'Authorization': 'Bearer ' + credentials.t } } )
        return await response.json()
    } catch(error) { console.log('Failed to remove user: ' + error) }
}

const getRoleID = async (role_name) => {
    console.log("FETCH for Role with name:", role_name)
    try {
        const url = `/api/roles/${role_name}`
        let response = await fetch(url, {
            method: get,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'}
        })
        return await response.json()
    } catch (error) { return {error: error} }
}

export { create, list, read, update, remove, validateAccount, getRoleID }
