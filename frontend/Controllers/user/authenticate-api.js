const signin = async (identifier, type, hp, signal) => {
    try {
        const data = (type === 'Email') ? {email: identifier, password: hp} : {username: identifier, password: hp}
        let response = await fetch('/api/auth/signin/', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data) } )
        return response.json()
    } catch(error) { return { error: `Fetch error: ${error}` }.json() }
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
    } catch(error) { return { error: `Fetch error: ${error}` }.json() }
}

const setupPassword = async (username) => {
    try {
        const url = '/api/users/reset_password/' + username
        let response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        } )
        return await response.json()
    } catch(error) { return { error: `Fetch error: ${error}` } }
}

const validatePassword = async (username, ticket) => {
    try {
        const url = `/api/validate/${username}/${ticket}`
        let response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        } )
        return await response.json()
    } catch (error) { console.log('Failed to FETCH Validation'); return {error: error}; }
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

export { signin, signout, setupPassword, validatePassword, validateAccount }
