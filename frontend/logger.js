require('dotenv').config('../')
const colors = require('colors')

const logger = (...args) => {
    if process.env.NODE_ENV != 'production') {
        console.log(...args, {color: "yellow"})
    }
}

export { logger }
