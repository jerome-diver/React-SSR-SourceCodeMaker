var express = require('express')
var router = express.Router()


/* GET home page. */
router.get('/', function(req, res, next) {
    const cookie_lng = JSON.parse(req.cookies.session).language
    req.i18n.changeLanguage(cookie_lng)
    console.log("=== /api/home, GET request, language is", req.i18n.language)
    const home_title = req.t('home.title')
    const home_content = req.t('home.content')
    res.json( {title: home_title, content: home_content} )
})

module.exports = router
