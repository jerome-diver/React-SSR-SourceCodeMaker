import { db } from '../controllers/database'
import { hasAuthorization, isOwnerOrAdmin } from './middlewares/authentication'
import Role from '../models/role.model'
import express from 'express'
const router = express.Router()
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
    Role.findOne({name: req.params.name}).exec()
        .then(role => { return res.status('200').json({error: null, role: role.toJSON()}) })
        .catch(err => { return res.status('401').json({error: err.message, role: null}) })
} )

/* GET roles listing. */
router.get('/', [hasAuthorization], (req, res) => {
    Role.find({}).exec()
        .then(roles => { return res.status(200).json(roles.map(role => {return role.toJSON()})) })
        .catch(error => { return res.status(401).json({error})})
})

/* POST to create new role */
router.post('/', (req, res) => { // Record to MongoDB 
    Role.create( { name: req.body.name,
                   color: req.body.color,
                   description: req.body.description }).exec()
        .then(role => { return res.status(201).json({error: '', accepted: true}) })
        .catch(error => { return res.status(400).json({accepted: false, error: error.message}) })
} )

router.put('/', [hasAuthorization, isOwnerOrAdmin], (req, res) => {
    const { role_form } = req.body
    Role.findOneAndUpdate({_id: role_form.id}, 
                          {$set: role_form}, 
                          {new: true}).exec()
        .then(role => { return res.status(201).json(role.toJSON()) })
        .catch(error => { return res.status(401).json({error})})
})

module.exports = router
