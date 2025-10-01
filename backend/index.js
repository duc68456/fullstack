// const http = require('http')
require('dotenv').config()
const express = require('express')
const Note = require('./models/note')
// const cors = require('cors')

// const mongoose = require('mongoose')

//
const path = require('path');
const fs = require('fs');

// const password = process.argv[2]
//
// const url = process.env.MONGODB_URI

// mongoose.set('strictQuery',false)
// mongoose.connect(url)
//   .then(result => {
//     console.log('connected to MongoDB')
//   })
//   .catch(error => {
//     console.log('error connecting to MongoDB:', error.message)
//   })

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })

// noteSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// const Note = mongoose.model('Note', noteSchema)

const app = express()

// app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    // .catch(error => {
    //   console.log(error.message)
    //   response.status(400).send({ error: 'malformatted id' })
    // })
    .catch(error => next(error))
    // })
})

// app.delete('/api/notes/:id', (request, response) => {
//   const id = request.params.id
//   notes = notes.filter(note => note.id !== id)

//   response.status(204).end()
// })
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const saveNotesToFile = () => {
  const data = { notes: notes }
  fs.writeFileSync(path.join(__dirname, '../introdemo/db.json'), JSON.stringify(data, null, 2))
}

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

// app.put('/api/notes/:id', (request, response) => {
//   const id = request.params.id
//   const body = request.body
  
//   const noteIndex = notes.findIndex(note => note.id === id)
  
//   if (noteIndex === -1) {
//     return response.status(404).json({ error: 'note not found' })
//   }
  
//   const updatedNote = {
//     id: id,
//     content: body.content,
//     important: body.important
//   }
  
//   notes[noteIndex] = updatedNote
//   saveNotesToFile()
//   response.json(updatedNote)
// })
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id)
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    // id: generateId(),
  })

  // notes = notes.concat(note)
  // response.json(note)
  note.save()
    .then(savedNote => {
    response.json(savedNote)
    })
    .catch(error => next(error))

})
// const PORT = 3001

const PORT = process.env.PORT

// // Serve những file build của frontend (từ introdemo/dist)
// app.use(express.static(path.join(__dirname, 'public')));
// // app.get('/*', (req, res) => {
// //   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// // });
// app.get(/^\/.*/, (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });


// // API của backend
// // Ví dụ: app.use('/api', require('./routes/api'));


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

app.listen(PORT)
console.log(`Server running on port ${PORT}`)