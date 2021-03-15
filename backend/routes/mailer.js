const express = require('express')
const router = express.Router()
import { emailValidation, emailResetPassword, emailModifyEmail } from './middlewares/emails'
const emailValidator = require('email-deep-validator')
import { isValid } from './middlewares/authentication'
import { checkEmail, sanitizer } from './middlewares/sanitizer'


/* POST to send email to validate new user account */
router.post('/account/validate', [emailValidation], (req, res) => {
    res.app.mailer.send('send_email_to_user', {
            to: req.email.to,
            subject: req.email.subject,
            title: req.email.title,
            content_title: req.email.content_title,
            introduction: req.email.introduction,
            text: req.email.text,
            link_validate: req.email.validation_link,
            submit_text: req.email.submit_text
        }, (error) => { return res.status(401).json( 
                {error: { name: 'Email failed', message: error }, 
                 sent: false}) })
    return res.status(200).json( { error: undefined, 
                                   sent: true,
                                  start: req.process.date.start, 
                                  end:   req.process.date.end })
} )

/* POST to send email to reset account password by rich destination to password setup page */
router.post('/account/reset_password', [emailResetPassword], (req, res) => {
    res.app.mailer.send('send_email_to_user', {
        to: req.email.to,
        subject: req.email.subject,
        title: req.email.title,
        content_title: req.email.content_title,
        introduction: req.email.introduction,
        text: req.email.text,
        link_validate: req.email.validation_link,
        submit_text: req.email.submit_text
    }, (error) => { return res.status(401).json({error: error, sent: false}) })
    return res.status(200).json({ error: undefined, 
                                  sent:  true, 
                                  start: req.process.date.start, 
                                  end:   req.process.date.end })
} )

/* POST to send email to modify account email by:
    _ send an email to:
        _ actual email box
        _ and new email box 
   with form action button to call frontend PageSwitcher router component,
   then final destination to ModifyEmail frontend component page 
   to show validation status updated. */
router.post('/account/modify_email', [isValid, checkEmail, sanitizer, emailModifyEmail], (req, res) => {
    const { newEmail, oldEmail } = req.body
    let emailSent = { oldEmail: {email: oldEmail} , newEmail: {email: newEmail} }
    for (const [key, value] of Object.entries(emailSent)) {
        res.app.mailer.send('send_email_to_user', {
            to: value.email,
            subject: req.email.subject,
            title: req.email.title,
            content_title: req.email.content_title,
            introduction: req.email.introduction,
            text: req.email.text,
            link_validate: req.email.validation_link,
            submit_text: req.email.submit_text
        }, (error) => { emailSent[key] = (error) 
                                    ? {...value, error: error, sent: false }
                                    : {...value, sent: true } } 
    ) }
    const status = (emailSent.oldEmail.sent && emailSent.newEmail.sent) ? 200 : 401
    return res.status(status).json(emailSent) 
} )

const verifyEmailExist = async (email) => {
    try {
        const checkEmail = new emailValidator()
        const { wellFormed, validDomain, validMailbox } = await checkEmail.verify(email)
        return (wellFormed && validDomain && validMailbox)
    } catch(error) {return JSON.stringify({error})}
}

router.post('/email/check', isValid, (req, res) => {
    const { email } = req.body
    verifyEmailExist(email)
        .then(status => { return res.status(200).json({status}) })
        .catch(error => { return res.status(400).json({error}) })
})


module.exports = router
