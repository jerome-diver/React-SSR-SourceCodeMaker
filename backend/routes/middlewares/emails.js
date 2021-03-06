/*
    Middleware for Express.js
    embed:
    _ emailValidation: to build email content to send for validation account process
    _ emailResetPassword: to build email content to reset password process
    _ emailModifyEmail: to build email content to modify email process
*/
import { i18n } from '../../i18n'
import { addDays, format } from 'date-fns'
import { fr as localeFR, en as localeEN } from 'date-fns/locale'
import User from '../../models/user.model'
var jwt = require('jsonwebtoken')
require('dotenv').config('../../')
const emailValidator = require('email-deep-validator')

const host = process.env.TAG + process.env.HOST + ":" + process.env.SERVER_PORT

const dates = (created) => {
    const format_date = `iiii, dd MMMM yyyy ${i18n.t('mailer:date.at')} HH:mm`
    let localization
    switch(i18n.language) {
        case 'fr':
            localization = localeFR
            break
        case 'en':
            localization = localeEN
            break
        default:
            localization = localeEN
    }
    return { start: format(created, format_date, {locale: localization}),
             end:   format(addDays(created, 2),format_date, {locale: localization}) }
}

/* Check email address is existing and valid */
const verifyEmailExist = async (email) => {
    try {
        const checkEmail = new emailValidator()
        const { wellFormed,
                validDomain,
                validMailbox } = await checkEmail.verify(email)
        return (wellFormed && validDomain && validMailbox)
    } catch(error) {return JSON.stringify({error})}
}

/* Find user created and build req.email content 
   to be used to send email for validation process 
   of new account created */
const emailValidation = (req, res, next) => {
    const { username } = req.body
    User.findOne({username: username}).exec()
        .then(user => {
            if (user.validated == true) { 
                return res.status(401).json( {error: {
                    name: i18n.t('mailer:account.validation.error.name'), 
                    message: i18n.t('mailer:account.validation.error.text') }} )}
            const date = dates(user.created)
            const ticket = user.ticket
            const username = user.username
            const token = jwt.sign({ user_id: user.id, valid_until: date.end },process.env.JWT_SECRET)
            req.date = date
            req.email = {
                to              : user.email,
                subject         : i18n.t('mailer:account.validation.subject'),
                title           : i18n.t('mailer:account.validation.title'),
                content_title   : i18n.t('mailer:account.validation.content.title'),
                introduction    : i18n.t('mailer:account.validation.content.introduction', 
                                         {date_start: date.start}),
                text            : i18n.t('mailer:account.validation.content.text' ,
                                         {date_end: date.end}),
                validation_link : `${host}/validate/${username}/${token}/${ticket}`,
                submit_text     : i18n.t('mailer:account.validation.submit_text')
            }
            next() })
        .catch(err => { return res.status(401).json({error: err, accepted: false}) })
}

/* Find user existing to build req.email content 
   to be used to send email for reset password process */
const emailResetPassword = (req, res, next) => {
    const { username } = req.body
    User.findOne({username}).exec()
        .then(user => {
            const date = dates(user.created)
            const url = host + '/setup_password'
            const setup_password_link = `${url}/${user.id}/${user.ticket}`
            req.process = date
            req.email = {
                to            : user.email,
                subject       : i18n.t('mailer:account.password.subject'),
                title         : i18n.t('mailer:account.password.title'),
                content_title : i18n.t('mailer:account.password.content.title'),
                introduction  : i18n.t('mailer:account.password.content.introduction', 
                                       {date_start: date.start}),
                text          : i18n.t('mailer:account.password.content.text', 
                                       {date_end: date.end}),
                submit_text   : i18n.t('mailer:account.password.submit_text'),
                link_validate : setup_password_link }
            next() })
        .catch(error => { return res.status(401).json({error}) } )
}

/* Find user existing to build req.email content 
   to be used to send emails (to old and new email address) 
   for modify email process.
     (at this middleware step, it should have been checked 
      user_id from session token to exist and 
      to be valid from authentication middleware) */
const emailModifyEmail = (req, res, next) => {
    const { newEmail, oldEmail, username } = req.body
    User.findOne({_id: req.user_id}).exec()
        .then(user => {
            const date = dates(user.created)
            const url = host + '/modify_email'
            const action_link = `${url}/${user.id}/${user.ticket}/${newEmail}`
            req.process = date
            req.email = {
                to              : `${newEmail} ${oldEmail}`,
                subject         : i18n.t('mailer:account.email.subject'),
                title           : i18n.t('mailer:account.email.title'),
                content_title   : i18n.t('mailer:account.email.content.title'),
                introduction    : i18n.t('mailer:account.email.content.introduction', 
                                            {username, date_start: date.start}),
                text            : i18n.t('mailer:account.email.content.text', 
                                            {email: newEmail, 
                                             old_email: oldEmail, 
                                             date_end: date.end}),
                validation_link : action_link,
                submit_text     : i18n.t('mailer:account.email.submit_text') }
            next() })
        .catch(err => {return res.status(401).json({error: err, sent: false})})
}

const emailContactUser = (req, res, next) => {
    const { id, content, subject } = req.body
    User.findOne({_id: id}).exec()
        .then(user => {
            req.email = {
                to:             user.email,
                subject:        subject,
                title:          i18n.t('mailer:contact.email.title', {user: user.username}),
                introduction:   i18n.t('mailer.contact.email.intro'),
                text:           content }
            next() })
        .catch(err => {return res.status(401).json({error: err, sent: false})})
}

const emailAlertUser = (req, res, next) => {
    const { id, mode, subject, content } = req.body

}

const sendEmail = (req, res, next) => {
    res.app.mailer.send('send_email_to_user', {
        to: req.email.to,
        subject: req.email.subject,
        title: req.email.title,
        content_title: req.email.content_title,
        introduction: req.email.introduction,
        text: req.email.text,
        link_validate: req.email.validation_link,
        submit_text: req.email.submit_text
    }, (error) => { 
        if (error) return res.status(401).json( 
                { error: { 
                    name: req.i18n.t('mailer:failed.title'), 
                    message: error
                }, 
                sent: false
                })
        next()
    })
}

export { emailValidation, emailResetPassword, emailModifyEmail, 
         emailContactUser, emailAlertUser,
         sendEmail, verifyEmailExist }