const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
import moment from 'moment'
import { db } from '../controllers/database'
import User from '../models/user.model'
var jwt = require('jsonwebtoken')
require('dotenv').config('../../')

const jsonParser = bodyParser.json()

/* GET validated user answer token */
router.post('/:ticket', jsonParser, (req, res) => {
    console.log("API search a user with from token decoded user_id, then update to be validated if not expired")
    const secret = process.env.JWT_SECRET
    const ticket = req.params.ticket
    jwt.verify(req.body.token, secret, (error, decoded) => {
        if(error) return res.status(403).json(
            {error: {name: 'token is wrong', message: error}})
        if (decoded.valid_util <= moment().valueOf()) 
            return res.status(401).send(
                {error: { name: 'expiry error', message: 'validation date expired' } } )
        console.log("TOKEN user_id is", decoded.user_id)
        console.log("ticket params is ", ticket)
        User.findOneAndUpdate( { _id: decoded.user_id, ticket: ticket }, 
                               { validated: true },
                               {new: true},
                               (error, user) => { 
             if (error) return res.status(401).json({error: {name: 'User update failed', message: error}})
            return res.json( { validated: true } )
        } )
    } ) 
} )

/* POST to send email to validate new user */

router.post('/', jsonParser, (req, res) => {
    const username = req.body.username
    User.findOne({username: username}, (err, user) => {
        if (err) {
            console.log("User doesn't exist: ", err)
            res.json( { error: err, accepted: false } )
        } else {
            if (user.validated) { return res.status(401).json({error: {name: 'Acount validation error', 
                                                                       message: 'Your account is allready validated'}})}
            console.log('Find user: ', user)
            const date_start = moment(user.created).format('DD/MM/YYY [at] HH:mm')
            const date_end = moment().add(2, 'days').format('DD/MM/YYY [at] HH:mm')
            const ticket = user.ticket
            const username = user.username
            const token = jwt.sign({ user_id: user.id, valid_until: date_end },process.env.JWT_SECRET)
            const validation_link = `http:/localhost:3000/validate/${username}/${token}/${ticket}`
            /* send an email to ask confirmation */
            res.app.mailer.send('send_email_to_user', {
                to: user.email,
                subject: 'Confirm your email to validate your new account',
                title: 'Source Code Maker, validation process',
                content_title: "New account validation for Source Maker Code web site",
                introduction: `The  ${date_start} you create a new user account on my Source Maker Code web site.`,
                text: `You should confirm your new account before the ${date_end} (local server UTC time) by clicking the next link.`,
                link_validate: validation_link,
                validation_text: 'Click this link to valid your account'
            }, (error) => {
                if (error) { return res.status(401).json( 
                    {error: {name: 'Email failed', message: error}, sent: false} ) }
                else { return res.status(200).json( { error: undefined, sent: true } ) } } )
    } } )
} )

module.exports = router
