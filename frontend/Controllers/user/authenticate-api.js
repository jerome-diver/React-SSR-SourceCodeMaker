import { cypher } from './user-form-helper'

const signin = async (identifier, type, password) => {
    console.log('--- signin with', identifier, type)
    try {
        const hpasswd = cypher(password)
        const data = (type === 'Email') ? {email: identifier, password: hpasswd} : {username: identifier, password: hpasswd}
        let response = await fetch('/api/auth/signin/', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data) } )
        return response.json()
    } catch(error) { return JSON.stringify({error: error}) }
}

const signout = async (id, signal) => {
    console.log("Fetch id to signout", id)
    try {
        let response = await fetch('/api/auth/signout', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            signal: signal,
            body: JSON.stringify({id: id})
        } )
        return await response.json()
    } catch(error) { return JSON.stringify({error: error}) }
}

const setupPassword = async (username) => {
    try {
        let response = await fetch('/api/users/reset_password', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username})
        } )
        return await response.json()
    } catch(error) { return JSON.stringify({error: error}) }
}

const updatePassword = async (id, ticket, password) => {
    try {
        let response = await fetch(`/api/users/setup_password/${id}/${ticket}`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({password: cypher(password)})
        } )
        return response.json()
    } catch (error) { return JSON.stringify({error: error}) }
}

const validatePassword = async (token, ticket) => {
    try {
        const url = `/api/validate/${ticket}`
        let response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {  'Accept': 'application/json', 
                        'Content-Type': 'application/json',
                       // 'Authorization': `Bearer ${token}`
                     },
            body: JSON.stringify({token: token})
        } )
        return await response.json()
    } catch (error) { return{error: error} }
}

const validateAccount = async (username) => {
    console.log("Start to send email with validation link inside for ", username)
    try {
        let response = await fetch(`/api/validate`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify( {username: username} ) } )
        return response.json() 
    } catch(error) { return{error: error} }
}

const updateEmail = async (username) => {
    try {
        let response = await fetch('', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify( {username: username} ) } )
        return response.json() 
    } catch(error) { return{error: error} }
}

export { signin, signout, setupPassword, validatePassword, validateAccount, updatePassword }
