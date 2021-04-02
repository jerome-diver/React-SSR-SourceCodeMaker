const express = require('express')
const router = express.Router()
import { emailValidation, emailResetPassword, emailModifyEmail,
         emailContactUser, emailAlertUser,
         sendEmail, verifyEmailExist } from './middlewares/emails'
import { isValid, isAdmin } from './middlewares/authentication'
import { checkEmail, sanitizer } from './middlewares/sanitizer'

/* POST to send email to validate new user account */
router.post('/account/validate',
            [emailValidation, sendEmail], (req, res) => {
    return res.status(202).json( { sent: true,
                                   start: req.date.start, 
                                   end:   req.date.end })
} )

/* POST to send email to reset account password by rich destination to password setup page */
router.post('/account/reset_password',
            [emailResetPassword, sendEmail], (req, res) => {
    return res.status(202).json({ sent:  true, 
                                  start: req.date.start, 
                                  end:   req.date.end })
} )

/* POST to send email to modify account email by:
    _ send an email to:
        _ actual email box
        _ and new email box 
   with form action button to call frontend PageSwitcher router component,
   then final destination to ModifyEmail frontend component page 
   to show validation status updated. */
router.post('/account/modify_email',
            [isValid, checkEmail, sanitizer, 
             emailModifyEmail, sendEmail], (req, res) => {
    return res.status(202).json({ sent:  true, 
                                  start: req.date.start, 
                                  end:   req.date.end })
} )

/* POST for Admin to contact user with a link to answer eventually */ 
router.post('/account/contact',
             [isValid, isAdmin, emailContactUser] , (req, res) => {

})

/* POST for Admin to alert user about something */ 
router.post('/account/alert',
             [isValid, isAdmin, emailAlertUser] , (req, res) => {

})

router.post('/email/check', isValid, (req, res) => {
    const { email } = req.body
    verifyEmailExist(email)
        .then(status => { return res.status(202).json({status}) })
        .catch(error => { return res.status(400).json({error}) })
})

module.exports = router
