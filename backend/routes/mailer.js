const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
import moment from 'moment'
import User from '../models/user.model'
var jwt = require('jsonwebtoken')
require('dotenv').config('../../')

const jsonParser = bodyParser.json()

/* POST to send email to validate new user account */
router.post('/account/validate', jsonParser, (req, res) => {
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

/* POST to reset password by new email to access new password setup */
router.post('/account/reset_password', jsonParser, (req, res) => {
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


module.exports = router