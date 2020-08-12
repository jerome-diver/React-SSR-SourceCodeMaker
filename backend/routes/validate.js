const express = require('express')
const router = express.Router()
import moment from 'moment'
import { db } from '../controllers/database'
import User from '../models/user.model'

/* GET users listing. */
router.get('/', (req, res) => {
    var user = User.find({
        username: req.param.username,
        ticket: req.param.ticket})
    user.validate = true
    User.update(user)
})
