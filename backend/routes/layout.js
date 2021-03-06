var express = require('express')
var router = express.Router()
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import App from '../../frontend/App'

/* GET -all- pages. */
router.get('*', function(req, res) {
    const context = {}
    const cookie_lng = (req.cookies.session) ? JSON.parse(req.cookies.session).language : req.language || 'en'
    //req.i18n.changeLanguage(cookie_lng)
    console.log("=== / layout, GET request, language is %s, but cookies language is", req.language, cookie_lng)
    const appContent = renderToString(
        <I18nextProvider i18n={req.i18n}>
            <StaticRouter location={req.url} context={context}>
                <App />
            </StaticRouter>
        </I18nextProvider>
        )
    if(context.url) {
        res.writeHead(301, { Location: context.url })
        res.end() 
    } else {
        res.render('layout', { 
        title: req.t('head.title'),
        lang: req.language,
        application: req.t('head.meta.application'),
        description: req.t('head.meta.description'),
        author: req.t('head.meta.author'),
        keywords: req.t('head.meta.keywords'),
        }, (err, html) => {
            res.write(html.replace(
                /(<div id="root">)(<\/div>)/, 
                (orig, d1, d2) => { return d1 + appContent + d2 }))
            res.end()
        } )
    }
})

module.exports = router
