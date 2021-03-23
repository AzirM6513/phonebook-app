const mongoose = require("mongoose");

if (process.argv.length < 5 && process.argv.length !== 3) {
  console.log(`
  to see all users: node mongo.js <password>
  to add user: node mongo.js <password> <name> <number>
  `);
  process.exit(1);
}

const password = process.argv[2] || undefined;
const name = process.argv[3] || undefined;
const number = process.argv[4] || undefined;

const url = `mongodb+srv://fullstack:${password}@cluster0.tiagu.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name,
  number,
});

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
}

if (name && number) {
  person.save().then(() => {
    console.log(`added ${name} ${number} to phonebook`);
    mongoose.connection.close();
  });
}