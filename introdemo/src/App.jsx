import { useState, useEffect } from 'react'
import Footer from './components/Footer'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'

const App = () => {
  const [notes, setNotes] = useState(null)
  // const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  // const toggleImportanceOf = id => {
  //   const url = `http://localhost:3001/notes/${id}`
  //   const note = notes.find(n => n.id === id)
  //   const changedNote = { ...note, important: !note.important }

  //   axios.put(url, changedNote).then(response => {
  //     setNotes(notes.map(note => note.id === id ? response.data : note))
  //   })
  // }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  // const hook = () => {
  //   console.log('effect')
  //   axios
  //     .get('http://localhost:3001/notes')
  //     .then(response => {
  //       console.log('promise fulfilled')
  //       setNotes(response.data)
  //     })
  // }

  // useEffect(hook, [])

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])
  
  if (!notes) { 
    return null 
  }
  
  console.log('render', notes.length, 'notes')

  // const addNote = (event) => {
  //   event.preventDefault()
  //   const noteObject = {
  //     content: newNote,
  //     important: Math.random() > 0.5,
  //     id: String(notes.length + 1),
  //   }

  //   axios
  //     .post('http://localhost:3001/notes', noteObject)
  //     .then(response => {
  //       setNotes(notes.concat(response.data))
  //       setNewNote('')
  //     })
  // }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} 
                note={note} 
                toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App

// import { useState, useEffect } from 'react'
// import axios from 'axios'

// const App = () => {
//   const [value, setValue] = useState('')
//   const [rates, setRates] = useState({})
//   const [currency, setCurrency] = useState(null)

//   useEffect(() => {
//     console.log('effect run, currency is now', currency)

//     // skip if currency is not defined
//     if (currency) {
//       console.log('fetching exchange rates...')
//       axios
//         .get(`https://open.er-api.com/v6/latest/${currency}`)
//         .then(response => {
//           console.log(response)
//           return setRates(response.data.rates)
//         })
//     }
//   }, [currency])

//   const handleChange = (event) => {
//     setValue(event.target.value)
//   }

//   const onSearch = (event) => {
//     event.preventDefault()
//     setCurrency(value)
//   }

//   console.log(value)

//   return (
//     <div>
//       <form onSubmit={onSearch}>
//         currency: <input value={value} onChange={handleChange} />
//         <button type="submit">exchange rate</button>
//       </form>
//       <pre>
//         {JSON.stringify(rates, null, 2)}
//       </pre>
//     </div>
//   )
// }

// export default App