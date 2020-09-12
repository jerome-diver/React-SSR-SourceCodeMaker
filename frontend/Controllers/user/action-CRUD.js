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
    } catch(error) { return JSON.stringify({error: error}) }
}

const list = async (signal) => {
    try {
        let response = await fetch('/api/users/', {
            method: 'GET',
            signal: signal } )
        return await response.json()
    } catch(error) { return{error: error} }
}

const read = async () => {
    try {
        const url = `/api/users/user`
        let response = await fetch(url, {
            method: 'GET',
            credentials: 'include' } )
        return await response.json()
    } catch(error) { return JSON.stringify({error: error}) }
}

const update = async (user, password, id) => {
    try {
        let response = await fetch('/api/users/' + id, {
            method: 'PUT',
            headers: { 'Accept': 'application/json',
                       'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({user: user, password: password}) } )
        return await response.json()
    } catch(error) { return{error: error} }
}

const remove = async (params, credentials) => {
    try {
        let response = await fetch('/api/users/' + params.id, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json',
                       'Content-Type': 'application/json',
                       'Authorization': 'Bearer ' + credentials.t } } )
        return await response.json()
    } catch(error) { return{error: error} }
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
    } catch (error) { return{error: error} }
}

export { create, list, read, update, remove, getRoleID }
