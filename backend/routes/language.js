var express = require('express')
var router = express.Router()

router.post('/', (req, res)=> {
    const language = req.body.language
    const cookie_lng = JSON.parse(req.cookies.session).language
    req.i18n.changeLanguage(language)
    console.log("=== /api/language, POST request, language is", 
                req.language, cookie_lng)
    return res.status(200).json({language: req.language})
})

router.get('/', (req, res)=> {
    console.log("=== /api/language, GET request, language is", req.language)
    return res.status(200).json({language: req.language})
})

module.exports = router
