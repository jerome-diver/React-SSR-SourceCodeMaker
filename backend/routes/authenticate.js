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
        if (err) return res.status(401).json( { error: err } )
        if (!user) return res.status(401).json( { error: { name: "Data entry error",
                                                           message: 'User not found or password wrong' } } )
        let _user = user.toJSON()
        console.log("We find the user:", _user)
        if(!user.authenticate(req.body.password)) return res.status(403).json({
                                                error: { name: "Authentictae error", 
                                                         message: "user authentication failed" } })
        console.log("And user signin provide a correct password")
        if (!user.validated) return res.status(403).json( { 
                                    error: {name: "Validity error", 
                                            message: "User account not valid"} } )
        console.log("And this account is valid")
        jwt.sign({ id: _user.id },process.env.JWT_SECRET, (er, token) => {
            if (err) return res.status(401).json( { error: er } )
            console.log("The token created is", token)
            res.cookie('token', token, { httpOnly: true })
            // Get role from user.role_id & add it to _user
            Role.findOne({_id: _user.role_id}, (error, role) => {
                if (error) return res.status(400).json({error: error})
                console.log("Get role:", role)
                _user = { ..._user, role: role.toJSON() }
                delete _user.role_id
                console.log('User now is:', _user)
                return res.status('200').json( { user: _user })
            } )
        } )
    } )
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
