require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Entry = require('./models/entry')
const { response } = require('express')
const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

const getRandomNumber = (range) => {
  const number =  Math.floor(Math.random() * range)

  if(entries.find(entry => entry.id === number)) {
    return getRandomNumber(range)
  } else {
    return number
  }
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, req, res, next) => {
  if(error.name === 'CastError') {
    return res.status(400).send({error: 'malformatted id'})
  }

  if(error.name === 'BodyError') {
    return res.status(400).send({error: 'Content missing'})
  }

  next(error)
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
  Entry.find({}).then(entries => res.json(entries))
})

app.post('/api/entries', (req, res, next) => {
  const body = req.body

  if(!body.name || !body.number) {
    const error = {
      name: 'BodyError'
    }
    next(error)
  } else {
    const entry = new Entry({
      name: body.name,
      number: body.number,
    })
  
    entry.save().then(result => res.json(result))
  }
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

app.delete('/api/entries/:id', (req, res, next) => {
  Entry.findByIdAndRemove(req.params.id)
  .then(result => {
    if(result) {
      res.status(204).end()
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})