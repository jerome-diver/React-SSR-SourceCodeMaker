import { cypher } from './user-form-helper'

const signin = async (identifier, type, password) => {
    console.log('--- signin with', identifier, type)
    try {
        const hpasswd = cypher(password)
        const data = (type === 'Email') 
            ? {email: identifier, password: hpasswd, local} 
            : {username: identifier, password: hpasswd, local}
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

/* POST request to send email with a link to setup new password */
const resetPassword = async (user, locale) => {
    try {
        let response = await fetch('/api/mailer/account/reset_password', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({username: user.username, locale})
        } )
        return await response.json()
    } catch(error) { return JSON.stringify({error: error}) }
}

/* POST request to send email to validate new account */
const validateAccount = async (user, locale) => {
    console.log("Start to send email with account validation action to", user.username)
    try {
        let response = await fetch(`/api/mailer/account/validate`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify( {username: user.username, locale} ) } )
        return response.json() 
    } catch(error) { return{error: error} }
}

const modifyEmail = async (user, locale) => {
    console.log("Start to send email with validation email modify action to", user.username)
    try {
        let response = await fetch('/api/mailer/account/modify_email', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify( {newEmail: user.new_email, 
                                   oldEmail: user.old_email, 
                                   username: user.username,
                                   locale } ) } )
        return response.json() 
    } catch(error) { return{error: error} }
}

const checkEmail = async (email) => {
    console.log("Check email: %s (POST api/mailer/email/check)", email)
    try {
        let response = await fetch('api/mailer/email/check', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({email: email})
        } )
        return response.json()
    } catch (error) { return JSON.stringify({error: error}) }
}

export { signin, signout, 
         resetPassword, 
         validateAccount, 
         modifyEmail, checkEmail }
