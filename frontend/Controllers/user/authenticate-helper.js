const { signout } = require("./authenticate-api")

const isAuthenticated = async (id, signal) => {
  console.log("Fetch id", id)
  try {
    let response = await fetch('/api/auth/authorized', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({id: id})
    })
    return await response.json()
  } catch (err) { return { error: err } }
}

function clearJWT(callback) {
    if (typeof window !== 'undefined') sessionStorage.removeItem('jwt')
    callback()
    signout().then( (data) => {
        document.cookie = 't=; expires=Thu, 01 Jan 1970 00:00:00 TC; path=/;'
    } )
}

export { isAuthenticated, clearJWT }
