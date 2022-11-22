const express = require('express')
const app = express()

app.use(express.json())

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

const getRandomNumber = (range) => {
  const number =  Math.floor(Math.random() * range)

  if(entries.find(entry => entry.id === number)) {
    return getRandomNumber(range)
  } else {
    return number
  }
}

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

app.post('/api/entries', (req, res) => {
  const body = req.body

  console.log(body)

  if(!body.name || !body.number) {
    return res.status(400).json({
      error: 'Content missing'
    })
  }

  const entry = {
    id: getRandomNumber(10000000),
    name: body.name,
    number: body.number
  }

  entries = entries.concat(entry)

  res.json(entry)
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})