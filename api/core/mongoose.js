import mongoose from 'mongoose'
import { MONGODB_URI } from '../env'
// mongodb database connection string. change it as per your needs. here "mydb" is the name of the database. You don't need to create DB from mongodb terminal. mongoose create the db automatically.
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.set('useCreateIndex', true)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function callback() {
  console.log('MongoDB Connected...')
})

export default db
