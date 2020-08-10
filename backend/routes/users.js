const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

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
    console.log('server created new user: ' + req.body.username)
    res.json({
        accepted: true,
        error: '',
    })
})

module.exports = router;
