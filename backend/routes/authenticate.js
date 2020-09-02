const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
import User from '../models/user.model'
import Role from '../models/role.model'
//import expressJwt from 'express-jwt'
var jwt = require('jsonwebtoken')
require('dotenv').config('../../')

const jsonParser = bodyParser.json()

const constructIdentifier = (data) => {
    let id = {}
    if (data.username) { id = {username: data.username} }
    if (data.email) { id = {...id, email: data.email} }
    return id
}

/* POST to sign in user with token to ask */
router.post('/signin', jsonParser, (req, res) => {
    console.log("Try to get the user, his role and check he is valid")
    const id = constructIdentifier(req.body)
    if (id === {}) { res.json({error: 'You have to provide an email or a username'}) }
    User.findOne(id, (err, user) => {
        if (!err) { 
            if (user) {
                console.log("I found a user in DB to authenticate")
                if(user.authenticate(req.body.password)) {
                    console.log("And user signin provide a correct password")
                    if (user.validated) {
                        console.log("And his account is valid")
                        jwt.sign({ id: user.id },process.env.JWT_SECRET, (err, token) => {
                            if (!err) {
                                console.log("The token created is", token)
                                res.cookie('token', token, { httpOnly: true })
                                //res.cookie('user', { username: user.username, role: role.name })
                                return res.status('200').json( { user: user.toJSON() })
                            } else { 
                                console.log("Failed to create token", err.message)
                                return res.status('401').json( { error: err.message } ) }
                        } )
                    } else { return res.status('401').json( { 
                        error: {name: "Validity error", 
                                message: "User account not valid"} } ) }
                } else { return res.status(401).json({error: { name: "Authentictae error", 
                                                               message: "user authentication failed" } }) }
            } else { return res.status('401').json( { error: { name: "Data entry error",
                                                               message: 'User not found or password wrong' } } ) }
        } else { return res.status('401').json( { error: err } ) } } )
} )

/* POST to sign out user with token to ask */
router.post('/signout', jsonParser, (req, res) => {
    const user_id = req.body.id
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    if (user_id == decoded.id) res.clearCookie('token')
    else return res.status(400).json({error: {name: "Rejected error", 
                                              message: "unknown user rejected" } } )
    return res.status('200').json(true)
} )

router.post('/authorized', jsonParser, (req, res) => {
    const user = req.body
    console.log("from /api/auth/authorized -- user id in JSON body passed:", user.id) 
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    console.log("from /api/auth/authorized -- COOKIES token decoded is", decoded)
    const authorized = (user.id == decoded.id)
    console.log("from /api/auth/authorized -- is authorized (user.id == token.id) ?", authorized)
    //authorized is payload decode, then "id" should be the current user.id
    return res.status(200).json({authorized: authorized})
})

module.exports = router
