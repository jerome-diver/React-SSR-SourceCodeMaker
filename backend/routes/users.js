const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
import moment from 'moment'
import { db } from '../controllers/database'
import User from '../models/user.model'
import Role from '../models/role.model'
import expressJwt from 'express-jwt'
import jwt from 'jsonwebtoken'
import { checkNewUser } from '../helpers/sanitizer'
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
        if (err) return res.status(400).json({error: err})
        res.json(o.map((u) => { return u.toJSON() })) })
})

/* GET user profile. */
router.get('/user', (req, res) => {
    const token = req.cookies.token
    const user_id = decodeJWT(token)
    console.log("Found user id:", user_id)
    if (user_id.error) return res.status(401).json({error: user_id.error})
    User.findOne({_id: user_id}, (err, user) => { 
        console.log("Searching for user")
        if (err) { return res.status(404).json({error: error}) } 
        else { 
            Role.findOne({_id: user.role_id}, (err, role) => {
                console.log("Searching for role")
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
        return status(400).json({error: {name: 'Validation entry failed', message: message} } )
    }
    Role.findOne({name: 'Reader'}, (err, role) => {  // find Role.id for Reader
        if (err) return res.status(400).json({ error: err })
        console.log("GET role id:", role.id)
        const user = new User( { // Record to MongoDB 
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role_id: role.id })
        user.save((err) => {
            if (err) {
                let message = ''
                if (!err.errors.isEmpty) {
                    err.errors.forEach(error => message += `${error.name}: ${error.message}\n`)
                } else return res.status(400).json({error: {name: error.name, message: error.message}})
                return res.status(400).json({error: {name: 'DB internal validation', message: message}})
            }
        })
        console.log("CREATED:", user)
        res.json( {accepted: true} ) } )
} )

/* PUT update user */

/* DELETE delete user */

/* POST to reset password by new email to access new password setup */

router.post('/reset_password/:username', jsonParser, (req, res) => {
    User.findOne({username: req.params.username}, 
        (err, user) => { 
            if (err) { return res.json({error: err}) }
            else {
                if(!user) { return res.json( {error: { name: "Users collection error",
                                                       message: "User doesn't exist" } } ) }
                else {
                    const date_now = moment(user.created).format('DD/MM/YYY [at] HH:mm')
                    const date_end = moment().add(2, 'days').format('DD/MM/YYY [at] HH:mm')
                    const url = 'http:/localhost:3000/setup_password'
                    const setup_password_link = `${url}/${user.id}/${user.ticket}`
                    res.app.mailer.send('send_email_to_user', {
                        to: user.email,
                        subject: 'Confirm your want to rest your password',
                        title: 'Source Code Maker, reset password process',
                        content_title: "Reset your password for Source Maker Code web site",
                        introduction: `The ${date_now}, you forget your password and then you would like to reset this one and setup a new one on my Source Maker Code web site.`,
                        text: `You should confirm you want to setup a new password before the ${date_end} (local server UTC time) by clicking the next link.`,
                        link_validate: setup_password_link,
                        validation_text: 'Click this link to setup a new password'
                    }, (error) => {
                        if (error) { return res.json( {error: error, sent: false} ) }
                        else { return res.json( { sent: true } ) } } )
                }
            }
    } )
} )

module.exports = router
