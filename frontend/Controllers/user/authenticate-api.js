const signin = async (username, email, hp, signal) => {
    try {
    const data = {username: username, email: email, password: hp}
    console.log("get data", data)
    let response = await fetch('/api/users/signin/', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data) } )
    return response.json()
    } catch(error) { return { error: `Fetch error: ${error}` }.json() }
}

const signout = async () => {
    try {
        let response = await fetch('auth/signout', {
            method: 'GET' } )
        return await response.json()
    } catch(error) { console.log('Failed to sign in: ' + error) }
}

export { signin, signout }
