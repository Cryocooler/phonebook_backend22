const { resp } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
morgan.token('pb', (req, response) => {
  if(req.method === 'POST') return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :pb'))


app.use(express.json())

let persons = [
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
    },

    {
      "id":5,
      "name": "Lewis Hamilton",
      "number": "13331313"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
    console.log(persons)
   
  })

app.get('/info', (req, resp) => {
  console.log('response params', Object.keys(req))
  resp.send(`Phonebook has info for ${persons.length} people
  <br>${new Date().toString()}</br>`)
  
})

app.get('/api/persons/:id', (req, resp) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    resp.json(person)
  } else {  resp.status(404).end()}

})

app.delete('/api/persons/:id', (req, resp) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  resp.status(204).end()
})

const generateID = () => {return Math.floor(Math.random() * (100-10) + 10)}


app.post('/api/persons', (req, resp) => {
  const body = req.body

  const newPerson = {
    id: generateID(),
    name: body.name,
    number: body.number,
    
  }

  if (!body.name || !body.number) {
    return resp.status(400).json({ 
      error: 'name or number missing'
    })
  } else if (persons.map(person => person.name).includes(body.name)) {
    return resp.status(400).json({
      error: "name must be unique"
    })
  }
    
  console.log(req.body)
  persons = persons.concat(newPerson)
  resp.json(newPerson)

})


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)