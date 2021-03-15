const express = require('express')
const router = express.Router()
import User from '../models/user.model'
import Role from '../models/role.model'
import { hasAuthorization, isRole } from './middlewares/authentication'
//import expressJwt from 'express-jwt'
var jwt = require('jsonwebtoken')
require('dotenv').config('../../')


const constructIdentifier = (data) => {
    let id = {}
    if (data.username) { id = {username: data.username} }
    if (data.email) { id = {...id, email: data.email} }
    return id
}

/* POST to sign in user with token to ask */
router.post('/signin', (req, res) => {
    console.log("=== signin router (POST /signin): Try to get the user, his role and check he is valid")
    const id = constructIdentifier(req.body)
    if (id === {}) { res.status(400).json({error: 'You have to provide an email or a username'}) }
    User.findOne(id, (err, user) => {
        if (err) return res.status(401).json( { error: err } )
        if (!user) return res.status(401).json( { error: { name: "Data entry error",
                                                           message: 'User not found or password wrong' } } )
        let _user = user.toJSON()
        console.log("=== signin router (POST /signin): We find the user:", _user)
        if(!user.authenticate(req.body.password)) return res.status(403).json({
                                                error: { name: "Authentictae error", 
                                                         message: "user authentication failed" } })
        console.log("=== signin router (POST /signin): And user signin provide a correct password")
        if (!user.validated) return res.status(403).json( { 
                                    error: {name: "Validity error", 
                                            message: "User account not valid"} } )
        console.log("=== signin router (POST /signin): And this account is valid")
        Role.findOne({_id: _user.role_id}, (error, role) => {
            if (error) return res.status(400).json({error: error})
            jwt.sign({ id: _user.id, role_name: role.name },
                     process.env.JWT_SECRET, 
                     (er, token) => {
                if (err) return res.status(401).json( { error: er } )
                res.cookie('token', token, { httpOnly: true })
                delete _user.role_id
                return res.status(200).json( { user: _user, role: role.toJSON() })
            } )
        } )
    } )
} )

/* POST to sign out user with token to ask */
router.post('/signout', [hasAuthorization], (req, res) => {
    res.clearCookie('token')
    return res.status('200').json(true)
} )

router.post('/authenticated', [hasAuthorization], (req, res) => {
    return res.status(200).json({authenticated: true})
})

router.post('/authorized/:role', [hasAuthorization, isRole], (req, res) => {
    return res.status(200).json({authorized: true})
})

module.exports = router
