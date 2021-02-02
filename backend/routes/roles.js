const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
import Crypto from 'crypto'
import moment from 'moment'
import { db } from '../controllers/database'
import Role from '../models/role.model'
import expressJwt from 'express-jwt'
import jwt from 'jsonwebtoken'
require('dotenv').config('../../')


const findMissing = (data) => {
    let missingMsg = ''
    if (!data.username || data.username === null) {
        missingMsg += "\nNo username received" }
    if (!data.email || data.email === null) {
        missingMsg += '\nNo email received' }
    return missingMsg
}

/* GET role. */
router.get('/:name', (req, res) => {
    console.log("Searching for Role:", req.params.name)
    Role.findOne({name: req.params.name}, 
        (err, role) => { 
            if (err) { return res.status('401').json({error: err.message, role: null}) } 
            else { return res.status('200').json( { error: null, role: role.toJSON() } ) }
    } )
} )

/* GET roles listing. */
router.get('/', (req, res) => {
    Role.find({}, (err, o) => { 
        return res.json(o.map((u) => { u.toObject() })) })
})

/* POST to create new role */
const jsonParser = bodyParser.json()

router.post('/', jsonParser, (req, res) => {
    Role.create( { // Record to MongoDB 
        name: req.body.name,
        color: req.body.color,
        description: req.body.description },
      (error, r) => {
        if (error) { return res.json({accepted: false, error: error.message}) }
        else { return res.json( {error: '', accepted: true} ) } } )
} )

module.exports = router
