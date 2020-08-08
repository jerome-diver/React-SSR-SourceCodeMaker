var express = require('express')
var router = express.Router()

/* GET signup page. */
router.get('/', function(req, res, next) {
    switch(req.query.call) {
        case 'in':
            res.render('signin', {} )
            break
        case 'up':
            res.render('signup', {} )
            break
    }
} )

module.exports = router
