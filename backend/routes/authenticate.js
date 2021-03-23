const express = require('express')
const router = express.Router()
import User from '../models/user.model'
import Role from '../models/role.model'
import { canConnect, hasAuthorization, isRole } from './middlewares/authentication'
//import expressJwt from 'express-jwt'
var jwt = require('jsonwebtoken')
require('dotenv').config('../../')


/* POST to sign in user with token to ask */
router.post('/signin', [canConnect], (req, res) => {
    Role.findOne({_id: req.user.role_id}).exec()
        .then(role => {
            jwt.sign({ id: req.user.id, role_name: role.name },
                    process.env.JWT_SECRET, 
                    (er, token) => {
                if (er) throw {
                    name: req.i18n.t('error:role.database.failed.title'),
                    message: er.message }
                res.cookie('token', token, { httpOnly: true })
                delete req.user.role_id
                return res.status(200).json({user: req.user, role: role.toJSON()}) }) })
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
