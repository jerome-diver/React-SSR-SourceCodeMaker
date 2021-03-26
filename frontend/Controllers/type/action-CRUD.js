/* Fetch Types CRUD actions */

const create = async (type) => {
    console.log("Create new type")
    const newType = { name: type.name,
                      description: type.description }
    try {
        let response = await fetch('/api/users', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Accept': 'application/json',
                       'Content-Type': 'application/json' },
            body: JSON.stringify(newType) } )
        return response.json()
    } catch(error) { return JSON.stringify({error}) }
}

const list = async (signal) => {
    console.log("List types")
    try {
        let response = await fetch('/api/types/', {
            method: 'GET',
            credentials: 'include',
            signal: signal } )
        return response.json()
    } catch(error) { return JSON.stringify({error}) }
}

const read = async (id) => {
    try {
        const url = `/api/types/id/${id}`
        let response = await fetch(url, {
            method: 'GET',
            credentials: 'include' } )
        return response.json()
    } catch(error) { return JSON.stringify({error: error}) }
}

const update = async (user, password, id) => {
    try {
        let response = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: { 'Accept': 'application/json',
                       'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({user_form: user, password: password}) } )
        return response.json()
    } catch(error) { return JSON.stringify({error: error}) }
}

const remove = async (params, credentials) => {
    try {
        let response = await fetch('/api/users/' + params.id, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Accept': 'application/json',
                       'Content-Type': 'application/json' } })
        return response.json()
    } catch(error) { return JSON.stringify({error: error}) }
}

const getTypeID = async (type_name) => {
    console.log("FETCH for Type with name:", type_name)
    try {
        const url = `/api/types/name/${type_name}`
        let response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'}
        })
        return response.json()
    } catch (error) { return JSON.stringify({error: error}) }
}

export { create, list, read, update, remove, getTypeID }