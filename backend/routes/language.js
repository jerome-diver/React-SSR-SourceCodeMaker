var express = require('express')
var router = express.Router()

router.post('/', (req, res)=> {
    const { language } = req.body
    const cookie_lng = (req.cookies.session) ? JSON.parse(req.cookies.session).language : ''
    req.i18n.changeLanguage(language)
    console.log("=== /api/language, POST request, language selected is %s, but session language is %s", 
                req.language, cookie_lng)
    return res.status(200)
})

router.get('/', (req, res)=> {
    const language = (req.cookies.session) ? JSON.parse(req.cookies.session).language : req.language
    req.i18n.changeLanguage(language)
    console.log("=== /api/language, GET request, language is", req.language)
    return res.status(200).json({language: req.i18n.language})
})

module.exports = router
