const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(express.static("build"));
app.use(morgan("tiny"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Use /api/persons for data</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    return res.json(person);
  }

  res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(406).json({
      error: "name or body missing",
    });
  }

  if (nameExists(body.name)) {
    return res.status(409).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: getRandomInt(1000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

const nameExists = (name) => {
  const personsNames = persons.map((person) => person.name.toLowerCase());
  return personsNames.includes(name.toLowerCase());
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

app.get("/info", (req, res) => {
  const info = `
    <div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}<p>
    </div>
    `;
  res.send(info);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
