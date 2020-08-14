var express = require('express')
const mailer = require('express-mailer')
const cors = require('cors')
const favicon = require('serve-favicon')

var app = express()

mailer.extend(app, {
    from: 'jerome.archlinux@gmail.com',
    host: 'smtp.gmail.com',
    secureConnection: true,
    port: 465,
    transportMethod: 'SMTP',
    auth: {
      user: 'jerome.archlinux@gmail.com',
      pass: process.env.EMAIL_PASSWORD
    }
})

var layoutRouter = require('./routes/layout')
var homeRouter = require('./routes/home')
var usersRouter = require('./routes/users')
var contactsRouter = require('./routes/contacts')
var subjectRouter = require('./routes/subject')
var adminRouter = require('./routes/admin')
var signRouter = require('./routes/sign')
var validateEmailRouter = require('./routes/validate')

app.use(favicon("./backend/img/favicon.ico"))

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
app.use('/template/contacts', contactsRouter)
app.use('/api/subject/*', subjectRouter)
app.use('/api/admin', adminRouter)
app.use('/api/validate', validateEmailRouter)
app.use('/template/sign', signRouter)
app.use('/', layoutRouter)

const port = normalizePort(process.env.PORT || '3000')
app.listen(port, () => {
  console.log("Express server started successfully")
})

function normalizePort(val) {
  var port = parseInt(val, 10)
  if (isNaN(port)) { return val; }
  if (port >= 0) { return port; }
  return false
}