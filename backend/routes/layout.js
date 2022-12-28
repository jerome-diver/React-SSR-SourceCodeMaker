// import React , { useEffect } from 'react'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { I18nextProvider } from 'react-i18next'
import App from '../../frontend/App'
import  BaseAppI18n from '../../frontend/client'
import { SSRProvider } from 'react-bootstrap'
// const pug = require('pug')
// import('../views/layout.pug')
let express = require('express')
let router = express.Router()

/* GET -all- pages. */
router.get('*', function(req, res) {
     const context = {}
     const options = { 
        title: req.t('head.title'),
        lang: req.language,
        application: req.t('head.meta.application'),
        description: req.t('head.meta.description'),
        author: req.t('head.meta.author'),
        keywords: req.t('head.meta.keywords'),
        }
    const appContent = renderToString(
        <SSRProvider>
        <I18nextProvider i18n={req.i18n}>
            <StaticRouter location={req.url}>
                <BaseAppI18n />
                {/* <App /> */}
            </StaticRouter>
        </I18nextProvider> 
        </SSRProvider>
    )
    console.log("FUCK !!!")
    if(context.url) {
        res.writeHead(301, { Location: context.url })
        res.end() 
    } else {
        res.render('layout', options, (err, html) => {
            console.log("WOOOOOWWWW.... ", html)
            res.write( html.replace('<div id="root"></div>', `<div id="root">${appContent}</div>`) )
            res.end()
        } )
    }

// const HTML = ({ i18n, url, context }) => {
//     return ( 
//             <I18nextProvider i18n={i18n}>
//                 <StaticRouter location={url} context={context}>
//                     <App />
//                 </StaticRouter>
//             </I18nextProvider>
// )}

// const HTMLupdated = ({ i18n, url, context, title, lang, application, description, author, keywords }) => {

//     const layoutOptions = { title, lang, application, description, author, keywords }
//     const html = pug.renderFile('build/pug/layout.pug', layoutOptions)

//     useEffect( () => { 
//         html.replace( '<div id="root"></div>)', `<div id="root">${<HTML i18n={i18n} url={url} context={context} />}</div>` )
//     }, [html, context, i18n, url])

//     return  html
// }

//     let didError = false
//     const lng = (req.cookies.session && JSON.parse(req.cookies.session).language) ? JSON.parse(req.cookies.session).language : req.language || 'en'
//     req.i18n.changeLanguage(lng)
//     //console.log("=== / layout, GET request, language is %s, but cookies session is %s, i18n resolvedLanguage is %s", req.language, req.cookies.session, req.i18n.resolvedLanguage)

//     const rootApp = renderToPipeableStream(
//         <HTMLupdated title={req.t('head.title')} lang={req.t('head.i18n.language')}
//                      application={req.t('head.meta.application')} description={req.t('head.meta.description')}
//                      author={req.t('head.meta.author')} keywords={req.t('head.meta.keywords')}
//                      i18n={req.i18n} url={req.url} context={context} />,
//         {
//             onShellReady() {
//                 res.statusCode = didError ? 500 : 200
//                 res.setHeader('Content-type', 'text/html')
//                 if(context.url) { res.writeHead(301, { Location: context.url }) } else { rootApp.pipe(res) }
//                 res.end()
//             },
//             onShellError(error) {
//                 res.statusCode = 500
//                 res.send('<!doctype html><p>Loading...</p><script src="js/client.js"></script>')
//             },
//             onError(err) {
//                 didError = true
//                 console.error(err)
//             },
//             onAllReady() {
//             }
//         }
//     )


})

module.exports = router
