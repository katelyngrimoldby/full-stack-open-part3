require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGO_URI

console.log('connecting to MongoDB')

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log(`Error connecting to MongoDB: ${error.message}`)
  })

  const entrySchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: [3, 'Name must be at least three characters long'],
      required: [true, 'Name is required']
    },
    number: {
      type: String,
      required: [true, 'Number is required'],
      validate: {
        validator: function(v) {
          return /\d{2,3}-\d{6,}/.test(v)
        },
        message: props => `${props.value} is not a valid phone number`
      }
    }
  })

  entrySchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
module.exports = mongoose.model('Entry', entrySchema)