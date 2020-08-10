import Crypto from 'crypto'

const cypher = (password) => {
    const ciphered = Crypto.createHash('sha256').update(password).digest('hex')
    return ciphered
}

export default cypher