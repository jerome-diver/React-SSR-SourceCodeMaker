var express = require('express')
var router = express.Router()

router.post('/', (req, res)=> {
    const language = req.body.language
    const cookie_lng = JSON.parse(req.cookies.session).language
    req.i18n.changeLanguage(language)
    console.log("=== /api/language, POST request, language is", 
                req.i18n.language, cookie_lng)
    res.status(200).json({language: req.i18n.language})
})

module.exports = router
