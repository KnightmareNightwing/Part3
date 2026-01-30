require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const Person = require('./models/person')


let persons = []

app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req) => { 
    return JSON.stringify(req.body); 
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
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

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
    // const id = request.params.id
    // const person = persons.find((person) => person.id === id)

    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter((person) => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    return String(Math.floor(Math.random() * (99999999999999 - 1 + 1)) + 1)
}

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
        mongoose.connection.close()
    })

   // persons = persons.concat(person)

   // response.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})