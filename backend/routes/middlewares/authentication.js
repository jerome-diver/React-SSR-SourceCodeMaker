var jwt = require('jsonwebtoken')
import { isBefore } from 'date-fns'
import User from '../../models/user.model'
import Role from '../../models/role.model'
import { i18n } from '../../i18n'
require('dotenv').config('../../')

/* ALL MIDDLEWARE USED TO AUTHORITY SESSION OR PROCESS TO CHECK FROM ROUTER */

/* email or username id... */
const constructIdentifier = (data) => {
    let id = {}
    if (data.username) { id = {username: data.username} }
    if (data.email) { id = {...id, email: data.email} }
    return id
}

/* check Rules ability for a container or a type */
const hasRules = (req, res, next) => {
    next()
}

/* Find and return the Role from request.user.role_id */
const findRole = (req, res, next) => {
    Role.findOne({_id: req.user.role_id}).exec()
        .then(role => { 
            if (role) {
                req.role = role.toJSON()
                next() } else return res.status(401).json({error: {name: "Database reference missing", 
                                                                   message: "No role found" } })
            } )
        .catch(error => { 
            console.log("find error:", error)
            return res.status(401).json({name: "Database error", 
                                        message: error }) })
}

/* Check that:
    _ user account can be found
    _ user account is enabled
    _ user password is ok
*/
const canConnect  = (req, res, next) => {
    const id = constructIdentifier(req.body)
    if (id === {}) { return res.status(400).json({error: req.i18n.t('error:authenticate.id.missing') }) }
    User.findOne(id).exec()
        .then(user => {
            if (user) {
                if(!user.authenticate(req.body.password)) throw ({ error: {
                    name: req.i18n.t('error:authenticate.user.password.title'), 
                    message: req.i18n.t('error:authenticate.user.password.message')} })
                if (!user.validated) throw ({ error: {
                    name: req.i18n.t('error:authenticate.user.disabled.title'),
                    message:  req.i18n.t('error:authenticate.user.disabled.message')} })
                req.user = user.toJSON()
                next() 
            } else return res.status(401).json({error: {name: "Database reference missing", 
                                                        message: "No user found" } })
        })
        .catch(error => {return res.status(401).json({name: "Database error", 
                                                      message: error }) })
}

/* check authorized session httpOnly:
   _ cookies.token id == cookies.session user.id
*/
const hasAuthorization = (req, res, next) => {
    const user_session = JSON.parse(req.cookies.session).user
    console.log("=== hasAuthorization middleware for user : %s", user_session.username) 
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    const authenticate = (user_session.id === decoded.id)
    if (!authenticate) return res.status(401).json({authenticated: false})
    if (decoded.error) return res.status(403).json({error: decoded.error})
    console.log("DECODED:", decoded)
    req.token = decoded
    next()
}

/* check :role params to be:
   _ cookies.session role.name == :role params
   _ cookies.session role.name == cookies.token role_name
*/
const isRole = (req, res, next) => {
    const role_to_authorize = req.params.role
    const role_session = JSON.parse(req.cookies.session).role
    console.log("=== isRole middleware for user role: %s", role_session.name) 
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    const authorized = (role_session.name === role_to_authorize) && 
                       (decoded.role_name === role_session.name)
    if (!authorized) return res.status(403).json({authorized: false})
    next()
}

const checkAdminRole = (req) => {
    const role_session = JSON.parse(req.cookies.session).role
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    const authorized = (role_session.name === 'Admin') && (decoded.role_name === role_session.name)
    if (!authorized) return {
                status: 403,
                authorized: false, 
                error: {
                    name: req.i18n.t('error:database.users.update.role.name'),
                    message: req.i18n.t('error:database.users.update.role.message')} }
    return { authorized: true }
}

/* check cookies for admin by:
   _ cookies.session role.name == 'Admin'
   _ cookies.token role_name == 'Admin' 
*/
const isAdmin = (req, res, next) => {
    console.log("=== isAdmin middleware check user account Role to be Admin")
    const adminRole = checkAdminRole(req)
    if (adminRole.authorized) { console.log("=== is Admin role, success"); next(); }
    else return res.status(adminRole.status).json({
                authorized: adminRole.authorized, 
                error: adminRole.error})
}

const checkValidAccount = (req) => {
    const secret = process.env.JWT_SECRET
    const { token } = req.cookies
    jwt.verify(token, secret, (error, decoded) => {
        if (error) return { status: 403,
                            validated: 'failed',
                            error }
        if (isBefore(decoded.valid_util, Date.now())) 
            return {
                status: 401,
                validated: 'failed', 
                error: { 
                    name: req.i18n.t('error:router.validation.verify.expired.name'), 
                    message: req.i18n.t('error:router.validation.verify.expired.name', 
                                        { date_expiry: decoded.valid_until }) } }
        if (req.params && req.params.ticket) req.ticket = req.params.ticket
        req.user_id = decoded.user_id
    })
    return { validated: true }
}
/* check validity from body.token for:
   _ token signed correct
   _ token.valid_until not expired
*/
const isValid = (req, res, next) => {
    console.log("=== isValid middleware check body token to be sign validated and not expired")
    const checkAccount = checkValidAccount(req)
    if (checkAccount.validated) { console.log("is valid account, success"); next(); } 
    else return res.status(checkAccount.status).json({validated: checkAccount.validated, 
                                                      error: checkAccount.error})
}

/* check if user logged is Owner or his role is Admin */
const isOwnerOrAdmin = (req, res, next) => {
    console.log("=== check if account session is valid owner OR is Admin role")
    const checkAccount = checkValidAccount(req)
    if (checkAccount.validated) { console.log("is owner account, success"); next(); }
    else { /* second chance to be an Admin user signed in */
        const adminRole = checkAdminRole(req)
        if(adminRole.authorized) { console.log("=== is Admin role, success"); next(); }
        return res.status(adminRole.status).json(
            { validated: checkAccount.validated,
              authorized: adminRole.authorized, 
              error: { name: req.i18n.t('error:authenticate.failed.update.title'),
                       message: req.i18n.t('error:authenticate.failed.update.message')}})
    }
}

export { canConnect, findRole, hasRules, hasAuthorization, isRole, isAdmin, isValid, isOwnerOrAdmin }
