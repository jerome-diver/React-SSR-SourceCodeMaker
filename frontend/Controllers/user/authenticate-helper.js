const { signout } = require("./authenticate-api")


function authenticate(jwt, callback) {
    if (typeof window !== 'undefined') { sessionStorage.setItem('jwt', JSON.stringify(jwt)) }
    callback()
}

function isAuthenticated() {
    if (typeof window !== 'undefined') return false
    if (sessionStorage.getItem('jwt')) return JSON.parse(sessionStorage.getItem('jwt'))
    return false
}

function clearJWT(callback) {
    if (typeof window !== 'undefined') sessionStorage.removeItem('jwt')
    callback()
    signout().then( (data) => {
        document.cookie = 't=; expires=Thu, 01 Jan 1970 00:00:00 TC; path=/;'
    } )
}

export { authenticate, isAuthenticated, clearJWT }
