var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/:lng', function(req, res) {
    const lng = req.params.lng
    req.i18n.changeLanguage(lng)
    console.log("=== /api/home, GET request, language is", req.language)
    const home_title = req.t('home.title')
    const home_content = req.t('home.content')
    res.status(200).json( {title: home_title, content: home_content} )
})

module.exports = router
