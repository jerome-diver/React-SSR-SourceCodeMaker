const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
import { db } from '../controllers/database'
import User from '../models/user.model'

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([
    { id: 1, username: "Jerome" }, 
    { id: 2, username: "Henry"}
  ]);
});

/* POST to create new user */
const jsonParser = bodyParser.json()

router.post('/', jsonParser, (req, res) => {
    User.create( {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password },
      (error, u) => {
        if (error) { res.json({accepted: false, error: error.message}) }
        else { res.json({accepted: true, error: ''}) }
    } )
})

module.exports = router;
