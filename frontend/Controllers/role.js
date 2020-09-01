const createRole = async (role) => {
    try {
        let response = await fetch('api/roles', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: role
        })
        return response.json()
    } catch(error) { return {error: error}}
}

const getRoles = async () => {
    try {
        let response = await fetch('/api/roles', {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        } )
        return response.json()
} catch(error) { return {error: error} }
}

const updateRole = async (id, updatedRole) => {
    try {
        const url = `api/roles/update/${id}`
        let response = await fetch(url, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: updatedRole
        })
        return response.json()
    } catch(error) { return {error: error}}
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
    } catch(error) { return {error: error}}
}

export { getRoles, createRole, updateRole, deleteRole }
