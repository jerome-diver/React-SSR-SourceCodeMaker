const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
import moment from 'moment'
import { db } from '../controllers/database'
import User from '../models/user.model'

/* GET validated user */
router.get('/:username/:ticket', (req, res) => {
    var user = User.findOneAndUpdate(
        { username: req.params.username, ticket: req.params.ticket},
        { validated: true },
        { new: true }, 
        (error, result) => {
            if (error) { res.json( {error: error, validated: false} ) }
            else { res.json( { error: null, validated: result.validated } ) }
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
            const url = 'http:/localhost:3000/api/validate'
            const validation_link = url + `/${user.username}/${user.ticket}`
            /* send an email to ask confirmation */
            res.app.mailer.send('new_user_confirm_email', {
                to: user.email,
                subject: 'Confirm your email to validate your new account',
                title: 'Source Maker Code validation process',
                content_title: "New account validation for Source Maker Code web site",
                introduction: `The  ${date_start} you create a new user account on my Source Maker Code web site.`,
                text: `You should confirm your new account before the ${date_end} (local server UTC time) by clicking the next link.`,
                link_validate: validation_link,
                validation_text: 'Click this link to valid your account'
            }, (error) => {
                console.error('ERROR is : ', error)
                if (error === null) { res.json( {error: error, sent: false} ) }
                else { res.json( { error: '', sent: true } ) } } )
    } } )
} )

module.exports = router
