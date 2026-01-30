
const mongoose = require('mongoose')

//const password = process.argv[2]

//const url = `mongodb+srv://fullstack:${password}@cluster0.albupft.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const url = process.env.MONGODB.URI

mongoose.set('strictQuery',false)

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: String
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

model.exports = mongoose.model('Person', personSchema)