const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
import moment from 'moment'
import { db } from '../controllers/database'
import User from '../models/user.model'
import Role from '../models/role.model'
import expressJwt from 'express-jwt'
import jwt from 'jsonwebtoken'
import { checkNewUser, checkUpdateUser } from '../helpers/sanitizer'
import { validationResult } from 'express-validator'
require('dotenv').config('../../')

const decodeJWT = (token) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) return { error: error } 
        else return decoded
    })
}

/* GET users listing. */
router.get('/', (req, res) => {
    User.find({}, (err, o) => {
        if (err) return res.status(401).json({error: err})
        res.json(o.map((u) => { return u.toJSON() })) })
})

/* GET user profile. */
router.get('/user', (req, res) => {
    const token = req.cookies.token
    console.log('=== users router (/user GET): THE TOKEN', token)
    const decoded_token = decodeJWT(token)
    if (decoded_token.error) return res.status(403).json({error: decoded_token.error})
    User.findOne({_id: decoded_token.id}, (err, user) => { 
        if (err) { return res.status(401).json({error: error}) } 
        else { 
            Role.findOne({_id: user.role_id}, (err, role) => {
                if (err) { return res.status(401).json({ error: err }) }
                return res.status('200').json( { user: user.toJSON(), role: role.toJSON() })
            } )
        }
    } )
} )

/* POST to create new user */
const jsonParser = bodyParser.json()
const formatMongooseError = (error) => {
    if(error.errors) {
        for (const [k, v] of Object.entries(error.errors)) {
            if (k == 'role') return {name: error.errors.role._message, 
                                     message: error.errors.role.errors.description.message }
        }
    }
    return error
}

router.post('/', jsonParser, checkNewUser, (req, res) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty) {
        let message = ''
        validationErrors.errors.forEach(error => message += `${error.param}: ${error.msg}\n`)
        return status(403).json({error: {name: req.i18n.t('error:router.users.parser.name'), message: message} } )
    }
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
router.put('/:id', jsonParser, checkUpdateUser, (req, res) => {
    const decoded_token = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    const user_form = req.body.user
    const user_id = req.params.id
    const password = req.body.password
    if ((decoded_token.id == user_id) || (decoded_token.role_name === 'Admin')) {
        const validationErrors = validationResult(req)
        if (!validationErrors.isEmpty) {
            let message = ''
            validationErrors.errors.forEach(error => message += `${error.param}: ${error.msg}\n`)
            return status(403).json({error: {name: req.i18n.t('error:router.users.parser.name'), message: message} } ) }
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
router.post('/setup_password/:id/:ticket', jsonParser, (req, res) => {
    const password = req.body.password
    const id = req.params.id
    const ticket = req.params.ticket
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
})

/* POST user account validation process with user ticket params, and http_only token body session */
router.post('/validate/account/:ticket', jsonParser, (req, res) => {
    console.log("===validate router (/:ticket POST): API search a user with from token decoded user_id, then update to be validated if not expired")
    const secret = process.env.JWT_SECRET
    const ticket = req.params.ticket
    jwt.verify(req.body.token, secret, (error, decoded) => {
        if(error) return res.status(403).json(
            {validated: 'failed',
             error: {name: req.i18n.t('error:router.validation.wrong_token.name'), message: error}})
        if (decoded.valid_util <= moment().valueOf()) 
            return res.status(401).send(
                {validated: 'failed', 
                 error: { name: req.i18n.t('error:router.validation.verify.expired.name'), 
                          message: req.i18n.t('error:router.validation.verify.expired.name', {date_expiry: decoded.valid_until}) } } )
        console.log("=== validate router (/:ticket POST): TOKEN user_id is", decoded.user_id)
        console.log("=== validate router (/:ticket POST): ticket params is ", ticket)
        User.findOneAndUpdate( { _id: decoded.user_id, ticket: ticket }, 
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
} )

module.exports = router
