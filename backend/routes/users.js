var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([
    { id: 1, username: "Jerome" }, 
    { id: 2, username: "Henry"}
  ]);
});

/* POST to create new user */
router.post('/', (req, res) => {
    console.log('server created new user: ' + req.body.username)
    res.json({
        accepted: true,
        error: '',
    })
})


module.exports = router;
