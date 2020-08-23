var express = require('express')
const mailer = require('express-mailer')
const cors = require('cors')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
require('dotenv').config('../')
import { agenda, agenda_schedule } from './controllers/schedule'

var app = express()

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

var layoutRouter = require('./routes/layout')
var homeRouter = require('./routes/home')
var usersRouter = require('./routes/users')
var contactsRouter = require('./routes/contacts')
var subjectRouter = require('./routes/subject')
var adminRouter = require('./routes/admin')
var validateEmailRouter = require('./routes/validate')

app.use(favicon("./backend/img/favicon.ico"))
app.use(cookieParser())
// view engine setup
app.set('views', 'backend/views')
app.set('view engine', 'pug')

// CROSS site ability
app.use(cors())
// modules used
app.use(express.json())
//app.use(express.urlencoded({ extended: false }))
// read dir as public:
app.use(express.static('build/public'))

// define route to use and action to respond from own defined requests
app.use('/api/home', homeRouter)
app.use('/api/users', usersRouter)
app.use('/template/contact', contactsRouter)
app.use('/api/subject/*', subjectRouter)
app.use('/api/admin', adminRouter)
app.use('/api/validate', validateEmailRouter)
app.use('/', layoutRouter)

const port = normalizePort(process.env.SERVER_PORT || '3000')

app.listen(port, () => {
  console.log("Express server started successfully")
})

//scheduler job tasks actions
agenda_schedule(agenda)
const realize = async () => { await agenda.stop(() => process.exit(0)) }
process.on('SIGTERM', realize )
process.on('SIGINT', realize )

function normalizePort(val) {
  var port = parseInt(val, 10)
  if (isNaN(port)) { return val; }
  if (port >= 0) { return port; }
  return false
}