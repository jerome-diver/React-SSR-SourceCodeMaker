import Role from '../models/role.model'
const mongoose = require('mongoose')
const fs = require('fs')
const url_db = `mongodb://${process.env.HOST}/${process.env.DB_NAME}`

mongoose.connect(url_db, { useNewUrlParser: true,
                           useUnifiedTopology: true,
                           useFindAndModify: false,
                           useCreateIndex: true })
const db = mongoose.connection
// Connect to MongoDB SourceCodeMaker database
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', () => { console.log('connected') } )

const init_db = function() {
    const file = './backend/models/init_seed_config.json'
    fs.readFile(file, 'utf-8', (err, contentFile) => {
        if(err) {
            console.log("Failed to read file", file)
            return
        }
        try {
            const config = JSON.parse(contentFile)
            Object.keys(config).forEach(model => {
              switch(model) {
                case 'Role':
                  Object.keys(config[model]).forEach(role => {
                    Role.findOne({name: config[model][role].name}, (err, x) => {
                      if (x) console.log('Role exist already:', config[model][role].name)
                      else {
                        Role.create(config[model][role], (err, r) => {
                          (err) ? console.log('Failed to create role', role, err.code)
                                : console.log("Created role", role)
                          return }) } }) })
                  break
              }
            })
        } catch (error) { 
            console.log("Error to parse and apply JSON config initialize database:", error)}
    })
}

export { db, mongoose, init_db }
