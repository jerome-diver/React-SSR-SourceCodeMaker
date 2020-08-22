const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/SourceCodeMaker', 
        { useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true} )
const db = mongoose.connection
// Connect to MongoDB SourceCodeMaker database
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', () => {
    console.log('connected')
})

export default { db, mongoose }
