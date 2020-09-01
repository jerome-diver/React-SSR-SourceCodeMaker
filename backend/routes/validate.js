const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
import moment from 'moment'
import { db } from '../controllers/database'
import User from '../models/user.model'
var jwt = require('jsonwebtoken')
require('dotenv').config('../../')

const decodeJWT = (token) => {
    jwt.decode(token, (error, decoded) => {
        if (error) return { error: error } 
        else return decoded
    })
}

/* GET validated user answer token */
router.get('/:token', (req, res) => {
    console.log("API search a user with from token decoded user.id, then update to be validated if not expired")
    const token = decodeJWT(req.params.token)
    const user_id = (!token.error) ? token.user_id : null
    if (!user_id) return res.status('401').send({ error: token.error})
    if (token.valid_util <= moment().valueOf()) return res.status('401').send({error: 'validation date expired'})
    User.findOneAndUpdate(
        { id: user_id },
        { validated: true },
        { new: true }, 
        (error, result) => {
            if (error) { return res.json( {error: error, validated: false} ) }
            else { return res.json( { error: null, validated: result.validated } ) }
        } )
} )

/* POST to send email to validate new user */
const jsonParser = bodyParser.json()

router.post('/', jsonParser, (req, res) => {
    const username = req.body.username
    User.findOne({username: username}, (err, user) => {
        if (err) {
            console.log("User doesn't exist: ", err)
            res.json( { error: err, accepted: false } )
        } else {
            console.log('Find user: ', user)
            const date_start = moment(user.created).format('DD/MM/YYY [at] HH:mm')
            const date_end = moment().add(2, 'days').format('DD/MM/YYY [at] HH:mm')
            const token = jwt.sign({ user_id: user.id, valid_until: date_end },process.env.JWT_SECRET)
            const validation_link = `http:/localhost:3000/validate/${token}`
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
                if (error) { return res.json( {error: error, sent: false} ) }
                else { return res.json( { error: '', sent: true } ) } } )
    } } )
} )

module.exports = router
