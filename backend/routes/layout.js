var express = require('express')
var router = express.Router()
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from '../../frontend/App'

/* GET -all- pages. */
router.get('*', function(req, res) {
    const context = {}
    const appContent = renderToString(
            <StaticRouter location={req.url} context={context}>
                <App />
            </StaticRouter>
        )
    if(context.url) {
        res.writeHead(301, { Location: context.url })
        res.end() 
    } else {
        res.render('layout', { 
        title: 'Source Code Maker (infos)',
        lang: "en",
        name: "Source Code maker (infos) my Freelance web site",
        content: "Let me show you example of my job's done and feel welcome to hire me up there.",
        }, (err, html) => {
            res.write(html.replace(
                /(<div id="root">)(<\/div>)/, 
                (orig, d1, d2) => { return d1 + appContent + d2 }))
            res.end()
        } )
    }
})

module.exports = router
