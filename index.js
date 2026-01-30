require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


//let persons = []

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)
app.use(cors())

morgan.token('body', (req) => { 
    return JSON.stringify(req.body); 
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        console.log(person)
        response.json(persons.map(p => p.toJSON()))
    })
})

app.get('/info', (request, response) => {
    const now = new Date();
    const formattedDate = now.toString();

    const htmlContent = '<html><body><h1>Phonebook has info for '+persons.length+' people</h1>'+
                        '<h1>'+formattedDate+'</h1></body></html>';

    response.set('Content-Type', 'text/html');
    response.send(htmlContent);
})

app.get('/api/persons/:id', (request, response, next) => {

    Person.findById(request.params.id)
    .then(person => {
        if(person){
            response.json(person)
        }else{
            response.status(404).end()
        }
    })
    .catch(error => next(error))

    // const id = request.params.id
    // const person = persons.find((person) => person.id === id)

    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
    // const id = request.params.id

    // persons = persons.filter((person) => person.id !== id)

    // response.status(204).end()
})

const generateId = () => {
    return String(Math.floor(Math.random() * (99999999999999 - 1 + 1)) + 1)
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
            return response.status(400).json({
                error: 'The name or number is missing',
            })
    }

    findPerson = persons.filter((person) => person.name == body.name)
    if(findPerson.length>0){
            return response.status(400).json({
                error: 'name must be unique',
            })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    person.save().then(result => {
        console.log('added ',person.name,' number',person.number,' to phonebook')
        response.json(result)
      //  mongoose.connection.close()
    })

   // persons = persons.concat(person)

   // response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})