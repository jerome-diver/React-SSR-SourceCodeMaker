const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
import moment from 'moment'
import { db } from '../controllers/database'
import User from '../models/user.model'

/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find({}, (err, o) => { res.json(o.map((u) => { return u.toObject() })) })
})

/* POST to create new user */
const jsonParser = bodyParser.json()

router.post('/', jsonParser, (req, res) => {
    User.create( { // Record to MongoDB 
        username: req.body.username,
        email: req.body.email,
        password: req.body.password },
      (error, u) => {
        if (error) { res.json({accepted: false, error: error.message}) }
        else {
          const status = send_email_to_validate(req.body.username)
          /* return JSON with accepted record */
          res.json(status) } // status : { accepted: bool, error: string }
    } )
})

const send_email_to_validate = (username) => {
    const {error, user} = User.findOne({username: username}, (err, user) => {
        if (err) {
            console.log("User doesn't exist: " + err)
            return { error: err, user: undefined }
        } else { return { error: '', user: user } } } )
    if (user === 'undefined') { return { error: error, accepted: false } }
    const date_start = user.created
    const date_end = moment().add('2 days').format('%d/%m/%Y at %H:%M')
    const localhost_web = 'http:/localhost:300/'
    const validation_link = localhost_web + `validate?user=${username}?ticket=${user.ticket}`
    /* send an email to ask confirmation */
    router.mailer.send('new_user_confirm_email', {
        to: user.email,
        subject: 'Confirm your email to validate your new account',
        title: 'Source Maker Code validation process',
        content_title: "New account validation for Source Maker Code web site",
        introduction: `The  ${date_start} you create a new user account on my Source Maker Code web site.`,
        text: `You should confirm your new account before the ${date_end} by clicking the next link.`,
        link_validate: validation_link,
        validation_text: 'Click this link to valid your account'
    })
    return { error: '', accepted: true }
}

module.exports = router;
