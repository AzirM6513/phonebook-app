require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const Person = require("./models/person");

app.use(express.json());
app.use(express.static("build"));
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("<h1>Use /api/persons for data</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (body === undefined) {
    return res.status(400).json({ error: "content missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.get("/info", (req, res) => {
  Person.countDocuments({}, (error, size) => {
    const info = `
    <div>
        <p>Phonebook has info for ${size} people</p>
        <p>${new Date()}<p>
    </div>
    `;

    res.send(info);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
