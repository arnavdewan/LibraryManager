const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const filePath = path.join(__dirname, 'books.json');

app.get('/books', (req, res) => {
  const books = JSON.parse(fs.readFileSync(filePath));
  res.json(books);
});

app.post('/books', (req, res) => {
  const books = JSON.parse(fs.readFileSync(filePath));
  books.push({ ...req.body, status: 'Available' });
  fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
  res.status(201).json({ message: 'Book added' });
});

app.delete('/books/:title', (req, res) => {
  let books = JSON.parse(fs.readFileSync(filePath));
  books = books.filter(book => book.title !== req.params.title);
  fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
  res.json({ message: 'Book deleted' });
});

app.put('/books/status/:title', (req, res) => {
  const books = JSON.parse(fs.readFileSync(filePath));
  const book = books.find(book => book.title === req.params.title);
  if (book) {
    book.status = book.status === 'Available' ? 'Borrowed' : 'Available';
    fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
    res.json({ message: 'Status updated' });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
