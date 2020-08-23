const mongoose = require('mongoose')
const url_db = `mongodb://${process.env.HOST}/${process.env.DB_NAME}`

mongoose.connect(url_db, { useNewUrlParser: true,
                             useUnifiedTopology: true,
                             useCreateIndex: true })
const db = mongoose.connection
// Connect to MongoDB SourceCodeMaker database
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', () => { console.log('connected') } )

export default { db, mongoose }
