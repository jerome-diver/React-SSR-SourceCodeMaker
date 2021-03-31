const express = require('express')
const router = express.Router()
import User from '../models/user.model'
import Role from '../models/role.model'
import { checkNewUser, checkUpdateUser, checkPassword, checkEmail, sanitizer } from './middlewares/sanitizer'
import { hasAuthorization, isRole, isValid, isAdmin, isOwnerOrAdmin } from './middlewares/authentication'
require('dotenv').config('../../')

/* GET users list */
router.get('/',
           [hasAuthorization, isAdmin],
           (req, res) => {
    User.find({}).exec()
        .then(users => { 
            Promise.all(users.map(user => {
                    return Role.findOne({_id: user.role_id}).exec()
                               .then(role => {
                                    return { user: user.toJSON(), 
                                             role: role.toJSON() } }) }) )
                .then(result => { return res.status(200).json(result) }) })
        .catch(error => { return res.status(401).json({error}) })
})

/* GET user profile. */
router.get('/user',
           [hasAuthorization],
           (req, res) => {
    console.log('=== users router (/user GET)')
    User.findOne({_id: req.token.id}).exec()
        .then(user => { 
            Role.findOne({_id: user.role_id}).exec()
                .then(role => {return res.status('200').json( { 
                    user: user.toJSON(), 
                    role: role.toJSON() }) }) })
        .catch(error => { return res.status(401).json({error}) })
})

router.post('/',
            [checkNewUser, sanitizer],
            (req, res) => {
    Role.findOne({name: 'Reader'}).exec()
        .then(role => {  // find Role.id for Reader
            const user = new User( { // Record to MongoDB 
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                role_id: role.id })
            user.save() })
        .catch(error => {
            let message = ''
            let name = ''
            if (error.errors) {
                err.errors.forEach(error => message += `${error.name}: ${error.message}\n`)
                name = req.i18n.t('error:database.users.create.failed.validation')
            }
            name = error.name
            message = error.code 
            return res.status(401).json({ error: { name, message } }) })
    return res.status(201).json( {accepted: true} )
})

/* PUT update user */
router.put('/',
           [hasAuthorization, isOwnerOrAdmin, checkUpdateUser, sanitizer],
           (req, res) => {
    const { user_form } = req.body
    User.findOneAndUpdate({_id: user_form.id}, 
                          {$set: user_form},
                          {new: true}).exec()
        .then(user => {
            Role.findOne({_id: user.role_id}).exec()
                .then(role => { 
                    return res.status(201).json({ user: user.toJSON(), 
                                                  role: role.toJSON() }) }) })
        .catch(error => { res.status(400).json({
                          error: { name: req.i18n.t('error:database.users.update.failed'), 
                                   message: error.message} }) })
})

/* DELETE delete user */
router.delete('/:id',
              [hasAuthorization, isOwnerOrAdmin],
              (req, res) => {
    User.deleteOne( { _id: req.params.id }).exec()
        .then(response => {return res.status(200).json({accepted: true}) })
        .catch(error => {
            return res.status(401).json( { 
                error: {
                    name: req.i18n.t('error:router.users.delete.failed'),
                    message: error.name } } ) })
})

/* POST user account to setup new password */
router.post('/setup_password/:id/:ticket',
            [hasAuthorization, isOwnerOrAdmin, checkPassword, sanitizer],
            (req, res, next) => {
    const password = req.body.password
    const id = req.params.id
    const ticket = req.params.ticket
    User.findOne({_id: id, ticket: ticket, validated: true}).exec()
        .then(user => {
            user.password = password
            return user.save() })
        .then(user => { return res.status(201).json({username: user.username}) })
        .catch(error => { return res.status(401).json({
            error: {
                name: req.i18n.t('error:database.users.update.failed.password'),
                message: error}}) })
})

/* POST user account validation process with user ticket params and http_only token body session */
router.post('/validate/account/:ticket', isValid, (req, res) => {
    console.log("=== users router (/validate/account/:ticket POST):\n\tTOKEN user_id: %s\n\tticket: %s", req.user_id, req.ticket)
    User.findOneAndUpdate( { _id: req.user_id, ticket: req.ticket }, 
                           { validated: true },
                           {new: true}).exec()
        .then(user => { return res.json({validated: 'success'}) })
        .catch(error => { return res.status(401).json({
                            validated: 'failed',
                            error: {name: req.i18n.t('error:database.user.update.failed.name'), 
                                    message: error}}) })
})

/* POST user email account modify with user ticket params and http_only token body session */
router.post('/modify/email/:ticket', [isValid, checkEmail, sanitizer], (req, res) => {
    console.log("=== users router (/modify/email/:ticket POST):\n\tTOKEN user_id: %s\n\tticket: %s", req.user_id, req.ticket)
    User.findOneAndUpdate( { _id: req.user_id, ticket: req.ticket }, 
                           { email: req.body.newEmail },
                           {new: true}).exec()
        .then(user => { return res.json({validated: 'success'}) })
        .catch(error => { return res.status(401).json({
                                validated: 'failed',
                                error: {name: req.i18n.t('error:database.user.update.failed.name'), 
                                        message: error}}) })
})

module.exports = router
