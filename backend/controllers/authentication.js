import expressJwt from 'express-jwt'
var jwt = require('jsonwebtoken')
import moment from 'moment'
require('dotenv').config('../../')

/* ALL MIDDLEWARE USED TO AUTHORITY SESSION OR PROCESS TO CHECK FROM ROUTER */

/* check authorized session httpOnly:
   _ cookies.token id == cookies.session user.id */
const hasAuthorization = (req, res, next) => {
    const user_session = JSON.parse(req.cookies.session).user
    console.log("=== hasAuthorization middleware for user : %s", user_session.username) 
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    const authenticate = (user_session.id === decoded.id)
    if (!authenticate) return res.status(401).json({authenticated: false})
    if (decoded.error) return res.status(403).json({error: decoded.error})
    req.token = decoded
    next()
}

/* check :role params to be:
   _ cookies.session role.name == :role params
   _ cookies.session role.name == cookies.token role_name */
const isRole = (req, res, next) => {
    const role_to_authorize = req.params.role
    const role_session = JSON.parse(req.cookies.session).role
    console.log("=== isRole middleware for user role: %s", role_session.name) 
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    const authorized = (role_session.name === role_to_authorize) && (decoded.role_name === role_session.name)
    if (!authorized) return res.status(403).json({authorized: false})
    next()
}

/* check cookies for admin by:
   _ cookies.session role.name == 'Admin'
   _ cookies.token role_name == 'Admin' */
const isAdmin = (req, res, next) => {
    const role_session = JSON.parse(req.cookies.session).role
    console.log("=== isAdmin middleware for user role: %s", role_session.name) 
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    const authorized = (role_session.name === 'Admin') && (decoded.role_name === role_session.name)
    if (!authorized) return res.status(403).json({authorized: false})
    next()
}

/* check validity from body.token for:
   _ token signed correct
   _ token.valid_until not expired */
const isValid = (req, res, next) => {
    const secret = process.env.JWT_SECRET
    console.log("=== isValid middleware check body token to be sign validated and not expired")
    jwt.verify(req.body.token, secret, (error, decoded) => {
        if(error) return res.status(403).json( {
            validated: 'failed',
            error: {
                name: req.i18n.t('error:router.validation.wrong_token.name'), 
                message: error } } )
        if (decoded.valid_util <= moment().valueOf()) 
            return res.status(401).send( {
                validated: 'failed', 
                error: { 
                    name: req.i18n.t('error:router.validation.verify.expired.name'), 
                    message: req.i18n.t('error:router.validation.verify.expired.name', 
                                        { date_expiry: decoded.valid_until } )   } } )
        req.ticket = req.params.ticket
        req.user_id = decoded.user_id
    })
    next()
}

export { hasAuthorization, isRole, isAdmin, isValid }
