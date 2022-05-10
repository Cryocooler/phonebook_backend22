require("dotenv").config();

const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

const errorHandler = (error, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(409).json({ error: error.message });
  }

  next(error);
};

app.use(express.static("build"));
app.use(cors());
morgan.token("pb", (req) => {
  if (req.method === "POST") return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :pb")
);
app.use(express.json());

// let persons = [
//     {
//       "id": 1,
//       "name": "Arto Hellas",
//       "number": "040-123456"
//     },
//     {
//       "id": 2,
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523"
//     },
//     {
//       "id": 3,
//       "name": "Dan Abramov",
//       "number": "12-43-234345"
//     },
//     {
//       "id": 4,
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122"
//     },

//     {
//       "id":5,
//       "name": "Lewis Hamilton",
//       "number": "13331313"
//     }
// ]

app.get("/api/persons", (_request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

app.get("/info", (req, resp) => {
  console.log("response params", Object.keys(req));
  Person.find({}).then((persons) => {
    resp.send(`Phonebook has info for ${persons.length} people
      <br>${new Date().toString()}</br>`);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((response) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
  //.catch(error => next(error))
});

app.post("/api/persons", (request, response, next) => {
  //console.log("POST TRIGGER");
  const body = request.body;
  //console.log('persons', persons.filter(person => person.name === body.name))

  if (!body.number || !body.name) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  // } else if (persons.map(person => person.name).includes(body.name)) {
  //   return response.status(400).json({
  //     error: "name must be unique"
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((savedPerson) => {
      console.log(response);
      response.json(savedPerson);
    })
    .catch((error) => {
      //console.log("NAME OF ERROR", error.name);
      next(error);

      //.catch((error) => next(error));
    });
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  console.log(req.body);
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) =>
      //console.log("PUT ERROR");
      next(error)
    );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(errorHandler);
