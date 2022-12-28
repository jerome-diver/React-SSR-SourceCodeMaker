import express from 'express'
import morganBody from 'morgan-body'
import fs from 'fs'
import { i18n, options } from './i18n'
import { agenda, agenda_schedule } from './controllers/schedule'
import { db, init_db } from './controllers/database'
const path = require('path')
const mailer = require('express-mailer')
const cors = require('cors')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const Backend = require('i18next-fs-backend')
const i18nextMiddleWare = require('i18next-http-middleware')
require('dotenv').config('../')
var app = express()
//app.set('trust proxy', 1)   // NGINX proxy web server requirement

mailer.extend(app, {
    from: process.env.EMAIL_FROM,
    host: process.env.EMAIL_HOST,
    secureConnection: true,
    port: process.env.EMAIL_PORT,
    transportMethod: 'SMTP',
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASSWORD
    }
})

const layoutRouter = require('./routes/layout')
const homeRouter = require('./routes/home')
const usersRouter = require('./routes/users')
const contactsRouter = require('./routes/contacts')
const typeRouter = require('./routes/types')
const containerRouter = require('./routes/containers')
const adminRouter = require('./routes/admin')
const sendMailRouter = require('./routes/mailer')
const rolesRouter = require('./routes/roles')
const authRouter = require('./routes/authenticate')
const setLanguage = require('./routes/language')

/* if (process.env.NODE_ENV !== 'production') {
  const { applyServerHMR } = require('i18next-hmr/server');
  applyServerHMR(i18n);
} */
i18n
  .use(Backend)
  .use(i18nextMiddleWare.LanguageDetector)
  .init({
    ...options,
    debug: false, //(process.env.NODE_ENV === 'development'),
    backend: { loadPath: './locales/{{lng}}/{{ns}}.json' }
  }, () => {
    app.use(i18nextMiddleWare.handle(i18n))
    app.use(favicon("./backend/img/favicon.ico"))   // add icon on tab browser
    app.use(cookieParser())                         // parse Cookies to router
    app.set('view engine', 'pug')                   // template views engine type (pug)
    app.set('views', 'backend/views')               // template views location
    app.use(cors( { origin: 'http://localhost:3000',
                    credentials: true, } ))                                 // Cross sites able
    app.use(express.urlencoded({extended: true}));
    app.use(express.json())                         // JSON Express module used
    app.use(express.static('build/public'))          // read dir as public
  //  app.use('./images', express.static('../images'))
    // define route to use and action to respond from own defined requests
    app.use('/api/language', [setLanguage])
    app.use('/api/home', homeRouter)
    app.use('/api/auth', [authRouter])
    app.use('/api/users', [usersRouter])
    app.use('/api/roles', [rolesRouter])
    app.use('/template/contact', contactsRouter)
    app.use('/api/containers', [containerRouter])
    app.use('/api/types', [typeRouter])
    app.use('/api/admin', [adminRouter])
    app.use('/api/mailer', [sendMailRouter])
    app.use('/', layoutRouter)

    const port = normalizePort(process.env.SERVER_PORT || '3000')
    app.listen(port, () => { console.log("Express server started successfully") })
  })

// Initialize first need entries in MongoDB database collections.
init_db()

// Logger body pretty if not production
if (process.env.NODE_ENV !== 'production') { 
  morganBody(app, 
    {theme: 'darkened'}) 
} else {
  const log = fs.createWriteStream(
    path.join(__dirname, "logs", "express.log"), { flags: 'a'}
  )
  morganBody(app, 
    { noColors: true,
      stream: log })
}

// scheduler job tasks actions
//agenda_schedule(agenda)
//const realize = async () => { await agenda.stop(() => process.exit(0)) }
//process.on('SIGTERM', realize )
//process.on('SIGINT', realize )

function normalizePort(val) {
  var port = parseInt(val, 10)
  if (isNaN(port)) { return val; }
  if (port >= 0) { return port; }
  return false
}