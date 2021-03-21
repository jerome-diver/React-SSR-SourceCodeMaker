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
    if (id === {}) { return res.status(400).json({error: req.i18n.t('authenticate:id.missing') }) }
    User.findOne(id).exec()
        .then(user => {
            let _user = user.toJSON()
            if(!user.authenticate(req.body.password)) throw {
                    name: "Authenticate error", 
                    message: "user authentication failed" }
            console.log("=== signin router (POST /signin): And user signin provide a correct password")
            if (!user.validated) throw { 
                name: "Validity error", 
                message: "User account not valid"}
            console.log("=== signin router (POST /signin): And this account is valid")
            Role.findOne({_id: _user.role_id}).exec()
                .then(role => {
                    jwt.sign({ id: _user.id, role_name: role.name },
                            process.env.JWT_SECRET, 
                            (er, token) => {
                    res.cookie('token', token, { httpOnly: true })
                    delete _user.role_id
                    return res.status(200).json({ user: _user, role: role.toJSON() })
            }) }) })
        .catch(error => {return res.status(401).json({error})})
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
