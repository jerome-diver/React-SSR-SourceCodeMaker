const createRole = async (role) => {
    try {
        let response = await fetch('api/roles', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: role
        })
        return response.json()
    } catch(error) { return JSON.stringify({error})}
}

const getRoles = async (signal) => {
    try {
        let response = await fetch('/api/roles', {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            signal: signal
        } )
        return response.json()
} catch(error) { return JSON.stringify({error}) }
}

const updateRole = async (form_role) => {
    try {
        const url = `api/roles/update/${id}`
        let response = await fetch(url, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({form_role})
        })
        return response.json()
    } catch(error) { return JSON.stringify({error})}
}

const deleteRole = async (id, admin) => {
    try {
        const url = `api/roles/delete/${id}`
        let response = await fetch(url, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: admin
        })
        return response.json()
    } catch(error) { return JSON.stringify({error})}
}

export { getRoles, createRole, updateRole, deleteRole }
