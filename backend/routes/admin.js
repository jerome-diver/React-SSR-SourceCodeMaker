var express = require('express')
var router = express.Router()

/* GET Admin page */
router.get("/", function(req, res) {
    res.json({
        username: "Jerome",
        first_name: 'Lanteri',
        second_name: 'Jerome',
        email: 'jerome.scaph@gmail.com',
    })
} )

module.exports = router
