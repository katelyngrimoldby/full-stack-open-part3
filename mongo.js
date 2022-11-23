const mongoose = require('mongoose')

if(process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

if(process.argv.length > 5) {
  console.log('Please enclose the name in quotes. e.g. "Arto Hellas"')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://admin:${password}@phonebook.8t18iim.mongodb.net/?retryWrites=true&w=majority`

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Entry = mongoose.model('Entry', entrySchema)

if(process.argv.length === 3) {
  mongoose
    .connect(url)
    .then(() => {
      Entry
        .find({})
        .then(result => {
          console.log('phonebook:')
          result.forEach(entry => {
            console.log(`${entry.name} ${entry.number}`)
          })
          mongoose.connection.close()
        })
    })
   } else if(process.argv.length === 5) {
  mongoose
  .connect(url)
  .then(() => {
    const entry = new Entry({
      name: process.argv[3],
      number: process.argv[4],
    })

    return entry.save()
  })
  .then((result) => {
    console.log(`Added ${result.name} with number ${result.number} to phonebook`)
    return mongoose.connection.close()
  })
  .catch(err => console.log(err))
} else {
  console.log('Please pass both name and number as arguments: node mongo.js <password> <name> <number>')
}

