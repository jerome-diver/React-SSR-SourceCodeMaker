import cipher from './user-form-helper'

const create = (user) => {
    console.log("Client POST request to create User: " + user.username)
    const newUser = { username: user.username,
                      email: user.email,
                      password: cipher(user.pass1) }
    return fetch('/api/users', {
            method: 'POST',
            headers: { 'Accept': 'application/json',
                        'Content-Type': 'application/json' },
            body: JSON.stringify(newUser) } )
        .then((response) => { return response.json() })
        .catch((error) => console.log('Failed to create user: ' + error) )
}

const list = async (signal) => {
    try {
        let response = await fetch('/api/users/', {
            method: 'GET',
            signal: signal } )
        return await response.json()
    } catch(error) { console.log('Failed to show users list: ' + error) }
}

const read = async (params, credentials, signal) => {
    try {
        let response = await fetch('/api/users/' + params.id, {
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

export { create, list, read, update, remove }
