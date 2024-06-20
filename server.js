const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let books = [];

// Endpoint to get the list of books
app.get('/books', (req, res) => {
  res.json(books);
});

// Endpoint to add a new book
app.post('/books', (req, res) => {
  const { title, author, progress } = req.body;
  if (!title || !author || progress == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const newBook = { title, author, progress };
  books.push(newBook);
  res.status(201).json(newBook);
});

// Endpoint to update book progress
app.post('/books/updateProgress', (req, res) => {
  const { title, progress } = req.body;
  const book = books.find(b => b.title === title);
  if (book) {
    book.progress = progress;
    res.json(book);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
