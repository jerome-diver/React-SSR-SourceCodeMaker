const { signout } = require("./authenticate-api")

function clearJWT(callback) {
    if (typeof window !== 'undefined') sessionStorage.removeItem('jwt')
    callback()
    signout().then( (data) => {
        document.cookie = 't=; expires=Thu, 01 Jan 1970 00:00:00 TC; path=/;'
    } )
}

export { isAuthenticated, clearJWT }
