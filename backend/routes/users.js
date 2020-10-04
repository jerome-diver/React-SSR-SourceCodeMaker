const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
import User from '../models/user.model'
import Role from '../models/role.model'
import jwt from 'jsonwebtoken'
import { checkNewUser, checkUpdateUser, checkPassword, sanitizer } from '../helpers/sanitizer'
import { hasAuthorization, isRole, isValid, isAdmin } from '../controllers/authentication'
require('dotenv').config('../../')

const jsonParser = bodyParser.json()

const decodeJWT = (token) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) return { error: error } 
        return decoded
    })
}

/* GET users listing. */
router.get('/', [jsonParser, hasAuthorization, isAdmin], (req, res) => {
    User.find({}, (err, users) => {
        if (err) return res.status(401).json({error: err})
        res.status(200).json(users.map((user) => { return user.toJSON() })) })
})

/* GET user profile. */
router.get('/user', [jsonParser, hasAuthorization], (req, res) => {
    console.log('=== users router (/user GET)')
    User.findOne({_id: req.token.id}, (err, user) => { 
        if (err) { return res.status(401).json({error: error}) } 
        else { 
            Role.findOne({_id: user.role_id}, (err, role) => {
                if (err) { return res.status(401).json({ error: err }) }
                return res.status('200').json( { user: user.toJSON(), role: role.toJSON() })
        } ) }
    } )
} )

/* POST to create new user */
const formatMongooseError = (error) => {
    if(error.errors) {
        for (const [k, v] of Object.entries(error.errors)) {
            if (k == 'role') return {name: error.errors.role._message, 
                                     message: error.errors.role.errors.description.message }
        }
    }
    return error
}

router.post('/', [jsonParser, checkNewUser, sanitizer], (req, res) => {
    Role.findOne({name: 'Reader'}, (err, role) => {  // find Role.id for Reader
        if (err) return res.status(400).json({ error: err })
        const user = new User( { // Record to MongoDB 
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role_id: role.id })
        user.save((err) => {
            if (err) {
                let message = ''
                if (err.errors) {
                    err.errors.forEach(error => message += `${error.name}: ${error.message}\n`)
                } else return res.status(401).json({error: {name: err.name, message: err.code}})
                return res.status(401).json({error: {name: req.i18n.t('error:database.users.create.failed.validation'), message: message}})
            }
        })
        res.status(201).json( {accepted: true} ) } )
} )

/* PUT update user */
router.put('/:id', [jsonParser, hasAuthorization, checkUpdateUser, sanitizer], (req, res) => {
    const user_form = req.body.user
    const user_id = req.params.id
    const password = req.body.password
    if ((req.token.id == user_id) || (req.token.role_name === 'Admin')) {
        User.findOne({_id: user_id, password: password}, (err, user) => {
            if (err) return res.status(401).json({error: {name: req.i18n.t('error:router:users.update.failed.password'), message: err}}) } )
        User.findOneAndUpdate({_id: user_id},
                            user_form,
                            {new: true}, (err, user) => {
            if (err) return res.status(400).json({error: {name: req.i18n.t('error:database.users.update.failed.name'), message: err}})
            else { 
                Role.findOne({_id: user.role_id}, (err, role) => {
                    if (err) { return res.status(401).json({ error: err }) }
                    return res.status('200').json({user: user.toJSON(), role: role.toJSON()}) } ) } } )
    } else return res.status(403).json({error: {name: req.i18n.t('error:router.users.token.authorization.name'), 
                                                message:  req.i18n.t('error:router.users.token.authorization.text')}})
})

/* DELETE delete user */

/* POST user account to setup new password */
router.post('/setup_password/:id/:ticket', [jsonParser, checkPassword, hasAuthorization, sanitizer], (req, res, next) => {
    const password = req.body.password
    const id = req.params.id
    const ticket = req.params.ticket
    if ((req.token.id == user_id) || (req.token.role_name === 'Admin')) {
        User.findOne({_id: id, 
                    ticket: ticket, 
                    validated: true}, (err, user) => {
                if (err) return res.status(401).json({error: {name: req.i18n.t('error:database.users.update.failed.password'),
                                                            message: err}})
                user.password = password
                user.save(err => {
                    if (err) return res.status(401).json({error: {name: req.i18n.t('error:database.users.update.failed.password'),
                                                                message: err}})
                })
                return res.status(201).json({username: user.username})
        })
    }
})

/* POST user account validation process with user ticket params, and http_only token body session */
router.post('/validate/account/:ticket', [jsonParser, isValid], (req, res) => {
    console.log("=== users router (/validate/account/:ticket POST):\n\tTOKEN user_id: %s\n\tticket: %s", req.user_id, req.ticket)
    User.findOneAndUpdate( { _id: req.user_id, ticket: req.ticket }, 
                           { validated: true },
                           {new: true},
                           (error, user) => { 
        if (error) return res.status(401).json({
                                validated: 'failed',
                                error: {name: req.i18n.t('error:database.user.update.failed.name'), 
                                        message: error}})
        return res.json( { validated: 'success' } )
    } ) 
} )

module.exports = router
