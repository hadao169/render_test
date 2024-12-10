import express from "express";
import morgan from "morgan";
import cors from "cors";
console.log(cors);
const app = express();

// Enable JSON parsing and CORS
app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

// Define morgan custom token
morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});
// Use morgan with the custom token
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let phonebookList = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(phonebookList);
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`
    <p>Phonebook has info for ${phonebookList.length} entries.</p>
    <p>${date}</p>
  `);
});

const isDuplicate = (persons, newName) => {
  return persons.some((person) => person.name === newName);
};

app.post("/api/persons", (req, res) => {
  let newID = Math.floor(Math.random() * 1000);
  const existingIDs = phonebookList.map((person) => person.id);
  while (existingIDs.includes(newID)) {
    newID = Math.floor(Math.random() * 1000);
  }

  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number is missing",
    });
  } else if (isDuplicate(phonebookList, body.name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const newEntry = { id: newID.toString(), ...body };
  phonebookList = [...phonebookList, newEntry];
  res.json(phonebookList);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = phonebookList.find((phonebook) => phonebook.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const deletedID = req.params.id;
  phonebookList = phonebookList.filter(
    (phonebook) => phonebook.id !== deletedID
  );
  if (deletedID) {
    res.json(phonebookList);
  } else {
    res.status(204).end();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
