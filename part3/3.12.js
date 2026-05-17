const mongoose = require('mongoose')

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: 'Ada Lovelace',
  number: '39-44-5323523',
})

person.save().then(() => {
  console.log('person saved!')
  mongoose.connection.close()
})
