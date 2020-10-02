const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
import moment from 'moment'
import User from '../models/user.model'
var jwt = require('jsonwebtoken')
require('dotenv').config('../../')

const jsonParser = bodyParser.json()

/* POST validate process with user ticket params, and http_only token body */
router.post('/:ticket', jsonParser, (req, res) => {
    console.log("===validate router (/:ticket POST): API search a user with from token decoded user_id, then update to be validated if not expired")
    const secret = process.env.JWT_SECRET
    const ticket = req.params.ticket
    jwt.verify(req.body.token, secret, (error, decoded) => {
        if(error) return res.status(403).json(
            {error: {name: req.i18n.t('error:router.validation.wrong_token.name'), message: error}})
        if (decoded.valid_util <= moment().valueOf()) 
            return res.status(401).send(
                {error: { name: req.i18n.t('error:router.validation.verify.expired.name'), 
                          message: req.i18n.t('error:router.validation.verify.expired.name', {date_expiry: decoded.valid_until}) } } )
        console.log("=== validate router (/:ticket POST): TOKEN user_id is", decoded.user_id)
        console.log("=== validate router (/:ticket POST): ticket params is ", ticket)
        User.findOneAndUpdate( { _id: decoded.user_id, ticket: ticket }, 
                               { validated: true },
                               {new: true},
                               (error, user) => { 
             if (error) return res.status(401).json({error: {name: req.i18n.t('error:database.user.update.failed.name'), message: error}})
            return res.json( { validated: true } )
        } )
    } ) 
} )

/* POST to send email to validate new user */
router.post('/', jsonParser, (req, res) => {
    const username = req.body.username
    User.findOne({username: username}, (err, user) => {
        if (err) {
            console.log("=== validate router (/ POST): User doesn't exist: ", err)
            res.json( { error: err, accepted: false } )
        } else {
            if (user.validated) { return res.status(401).json({error: {name: req.i18n.t('mailer:account.validation.error.name'), 
                                                                       message: req.i18n.t('mailer:account.validation.error.text')}})}
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
                subject: req.i18n.t('mailer:account.validation.subject'),
                title: req.i18n.t('mailer:account.validation.title'),
                content_title: req.i18n.t('mailer:account.validation.content.title'),
                introduction: req.i18n.t('mailer:account.validation.content.introduction', {date_start: date_start}),
                text: req.i18n.t('mailer:account.validation.content.text' ,{date_end: date_end}),
                link_validate: validation_link,
                validation_text: req.i18n.t('mailer:account.validation.link_label')
            }, (error) => {
                if (error) { return res.status(401).json( 
                    {error: {name: 'Email failed', message: error}, sent: false} ) }
                else { return res.status(200).json( { error: undefined, sent: true } ) } } )
    } } )
} )

module.exports = router
