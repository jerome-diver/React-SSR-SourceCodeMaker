const express = require('express')
const router = express.Router()
import { canConnect, findRole, hasAuthorization, isRole } from './middlewares/authentication'
var jwt = require('jsonwebtoken')
require('dotenv').config('../../')


/* POST to sign in user with token to ask */
router.post('/signin', [canConnect, findRole], (req, res) => {
    jwt.sign({ id: req.user.id, role_name: req.role.name },
            process.env.JWT_SECRET, 
            (error, token) => {
        if (error) return res.status(401).json({
            name: req.i18n.t('error:jwt.sign.failed'),
            message: er.message })
        res.cookie('token', token, { httpOnly: true })
        delete req.user.role_id
        return res.status(200).json({
            user: req.user, 
            role: req.role.toJSON()}) 
    })
})

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
