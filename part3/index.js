require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Entry = require('./models/entry');
const app = express();

app.use(express.json());
app.use(express.static('dist'));
app.use(cors());

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  if(error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' });
  }
  if(error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.get('/info', (req, res) => {
  const date = new Date();
  Entry.find({})
    .then(entries => {
      const message = `<div>
        <p>Phonebook has information for ${entries.length} person/people</p>
        <p>${date.toLocaleString('en-US')}</p>
      </div>`;
      res.send(message);
    });
});

app.get('/api/entries', (req, res) => {
  Entry.find({}).then(entries => res.json(entries));
});

app.get('/api/entries/:id', (req, res, next) => {
  Entry.findById(req.params.id)
    .then(entry => {
      if(entry) {
        res.json(entry);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.post('/api/entries', (req, res, next) => {
  const body = req.body;

  const entry = new Entry({
    name: body.name,
    number: body.number,
  });

  Entry.find({ name: body.name })
    .then(entries => {
      if(entries.length > 0) {
        return res.status(400).json({ error: `${body.name} is already in the phonebook` });
      } else {
        entry.save()
          .then(result => res.json(result))
          .catch(error => next(error));
      }
    });
});

app.delete('/api/entries/:id', (req, res, next) => {
  Entry.findByIdAndRemove(req.params.id)
    .then(result => {
      if(result) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.put('/api/entries/:id', (req, res, next) => {
  const body = req.body;

  const entry = {
    name: body.name,
    number: body.number
  };

  Entry.findByIdAndUpdate(req.params.id, entry, { new: true, runValidators: true, context: 'query' })
    .then(entry => res.json(entry))
    .catch(error => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});