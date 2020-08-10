import Crypto from 'crypto'

const cypher = (password) => {
    const ciphered = Crypto.createHash('sha256').update(password).digest('hex')
    return ciphered
}

const checkPassword = (password) => {
    var checkChar = {
        countEnough: (password.length >= 8),
        special: password.match(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/),
        upperCase: password.match(/(?=.*[A-Z])/),
        lowerCase: password.match(/(?=.*[a-z])/),
        aNumber: password.match(/(?=.*[0-9])/),
    }
    return checkChar
}

export default [cypher, checkPassword]