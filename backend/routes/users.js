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

/* POST to reset password by new email to access new password setup */
router.post('/reset_password', jsonParser, (req, res) => {
    User.findOne({username: req.body.username}, 
        (err, user) => { 
            if (err) { return res.status(401).json({error: err}) }
            if(!user) { return res.status(401).json( {error: { name: req.i18n.t('error:router.users.delete.missing.name'),
                                                               message: req.i18n.t('error:router.users.delete.missing.text')} } ) }
            const date_now = moment(user.created).format('DD/MM/YYY [at] HH:mm')
            const date_end = moment().add(2, 'days').format('DD/MM/YYY [at] HH:mm')
            const url = 'http:/localhost:3000/setup_password'
            const setup_password_link = `${url}/${user.id}/${user.ticket}`
            res.app.mailer.send('send_email_to_user', {
                to: user.email,
                subject: req.i18n.t('mailer:account.password.subject'),
                title: req.i18n.t('mailer:account.password.title'),
                content_title: req.i18n.t('mailer:account.password.content.title'),
                introduction: req.i18n.t('mailer:account.password.content.introduction', {date_now: date_now}),
                text: req.i18n.t('mailer:account.password.content.text', {date_end: date_end}),
                link_validate: setup_password_link,
                validation_text: req.i18n.t('mailer:account.password.link_label')
            }, (error) => { return (error) ? res.status(401).json({error: error, sent: false}) 
                                           : res.status(200).json({sent: true})    } )
    } )
} )

/* SETUP PASSWORD */
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

module.exports = router
