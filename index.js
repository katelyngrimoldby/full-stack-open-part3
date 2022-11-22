const { response } = require('express')
const express = require('express')
const app = express()

let entries = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/info', (req, res) => {

  const date = new Date()
  res.send(
    `<div>
      <p>Phonebook has information for ${entries.length} people</p>
      <p>${date.toLocaleString('en-US')}</p>
    </div>`
  )
})

app.get('/api/entries', (req, res) => {
  res.json(entries)
})

app.get('/api/entries/:id', (req, res) => {
  const id = Number(req.params.id)
  const entry = entries.find(entry => entry.id === id)

  if(entry) {
    res.json(entry)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/entries/:id', (req, res) => {
  const id = Number(req.params.id)

  if(entries.find(entry => entry.id === id)) {
    entries = entries.filter(entry => entry.id !== id)
    res.status(204).end()
  } else {
    res.status(404).end()
  }
  

  
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})