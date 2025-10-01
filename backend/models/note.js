const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  // content: String,
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean,
})

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })
  
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id,
        delete returnedObject._id,
        delete returnedObject.__v
    }
})

const Note = mongoose.model('Note', noteSchema)

module.exports = Note