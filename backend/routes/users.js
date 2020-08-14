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
        else { res.json( {error: '', accepted: true} ) } } )
} )

/* GET user profile. */
router.get('/:username', function(req, res, next) {
    User.find({username: req.params.username}, 
        (err, user) => { 
            if (err) { res.json({error: error, user: null})
            } else { res.json( { error: null, user: user.toObject() } ) }
    } )
} )

module.exports = router
