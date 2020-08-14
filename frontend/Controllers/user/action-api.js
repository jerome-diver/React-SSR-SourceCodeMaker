import { cypher } from './user-form-helper'

const create = async (user) => {
    const newUser = { username: user.username,
                      email: user.email,
                      password: cypher(user.pass1) }
    let response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Accept': 'application/json',
                       'Content-Type': 'application/json' },
            body: JSON.stringify(newUser) } )
    return response.json()
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

const read = async (username, credentials, signal) => {
    try {
        let response = await fetch('/api/users/' + username, {
            method: 'GET',
            signal: signal,
            headers: { 'Accept': 'application/json',
                       'Content-Type': 'application/json',
                       'Authorization': 'Bearer ' + credentials.t } } )
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

export { create, list, read, update, remove, validateAccount }
