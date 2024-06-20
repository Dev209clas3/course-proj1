const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());

let books = [];

function loadBooks() {
    try {
        const data = fs.readFileSync('books.json');
        books = JSON.parse(data);
    } catch (error) {
        books = [];
    }
}

function saveBooks() {
    fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
}

loadBooks();

// GET all books
app.get('/books', (req, res) => {
    res.json(books);
});

// GET a specific book by title
app.get('/books/:title', (req, res) => {
    const book = books.find(b => b.title === req.params.title);
    if (book) {
        res.json(book);
    } else {
        res.status(404).send('Book not found');
    }
});

// POST a new book
app.post('/books', (req, res) => {
    const newBook = req.body;
    books.push(newBook);
    saveBooks();
    res.status(201).send('Book added');
});

// PUT route to replace an entire book
app.put('/books/:title', (req, res) => {
    const title = req.params.title;
    const newBook = req.body;
    const bookIndex = books.findIndex(book => book.title === title);
    if (bookIndex !== -1) {
        books[bookIndex] = newBook;
        saveBooks();
        res.status(200).send('Book updated');
    } else {
        res.status(404).send('Book not found');
    }
});

// POST route to update book progress
app.post('/books/updateProgress', (req, res) => {
    const { title, progress } = req.body;
    const bookIndex = books.findIndex(book => book.title === title);
    if (bookIndex !== -1) {
        books[bookIndex].progress = progress;
        saveBooks();
        res.status(200).send('Book progress updated');
    } else {
        res.status(404).send('Book not found');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
