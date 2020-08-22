const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
import Crypto from 'crypto'
import moment from 'moment'
import { db } from '../controllers/database'
import User from '../models/user.model'
import expressJwt from 'express-jwt'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config'


const authenticate = (pass, salt, hash_pass) => {
    return Crypto.createHmac('sha256', salt)
                         .update(pass)
                         .digest('hex') === hash_pass
}
const findMissing = (data) => {
    let missingMsg = ''
    if (!data.username || data.username === null) {
        missingMsg += "\nNo username received" }
    if (!data.email || data.email === null) {
        missingMsg += '\nNo email received' }
    return missingMsg
}

/* GET user profile. */
router.get('/:username', (req, res) => {
    User.findOne({username: req.params.username}, 
        (err, user) => { 
            if (err) { return res.status(404).json({error: error, user: null}) } 
            else { return res.status(200).json( { error: null, user: user.toJSON() } ) }
    } )
} )

/* GET users listing. */
router.get('/', (req, res) => {
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

/* POST to sign in user with token to ask */
router.post('/signin', jsonParser, (req, res) => {
    const msg = findMissing(req.body)
    if (msg !== '') { res.json({error: msg}) }
    User.findOne( { username: req.body.username, 
                    email: req.body.email },
        (err, user) => {
            if (!err) { 
                if (user) {
                    if(user.authenticate(req.body.password)) {
                        const token = jwt.sign({id: user.id}, jwtSecret)
                //        res.cookie('token', token, {expire: new Date() + 999})
                        return res.json( {
                            user: user.toJSON(), 
                            token: token,
                            error: err } ) } }
                return res.status(404).json({error: 'User not found or password wrong'}) }
            else { return res.status(404).json( { error: err } ) } } )
} )

/* POST to sign out user with token to ask */
router.post('/signout', jsonParser, (req, res) => {
 //   res.clearCookie('token')
 //   res.clearCookie('username')
    return res.status('200').json({message: 'signed out'})
} )

module.exports = router
