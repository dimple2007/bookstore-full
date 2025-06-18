import express from 'express';
import bodyParser from 'body-parser';
import books from './booksdb.js';
import { users, isValid, authenticateUser } from './users.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 3020;
const SECRET = "fingerprint_customer";

// TASK 1
app.get('/books', (req, res) => {
  res.json(books);
});

// TASK 2
app.get('/books/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  res.json(book ? book : { message: "Book not found" });
});

// TASK 3
app.get('/books/author/:author', (req, res) => {
  const filtered = Object.values(books).filter(book => book.author === req.params.author);
  res.json(filtered);
});

// TASK 4
app.get('/books/title/:title', (req, res) => {
  const filtered = Object.values(books).filter(book => book.title === req.params.title);
  res.json(filtered);
});

// TASK 5
app.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  res.json(book?.reviews || {});
});

// TASK 6
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (isValid(username)) return res.status(409).json({ message: "User already exists" });
  users.push({ username, password });
  res.json({ message: "User registered" });
});

// TASK 7
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!authenticateUser(username, password)) return res.status(403).json({ message: "Invalid credentials" });

  const accessToken = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ token: accessToken });
});

// Middleware to verify token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: "Missing token" });

  jwt.verify(authHeader, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

// TASK 8
app.put('/auth/review/:isbn', verifyToken, (req, res) => {
  const { review } = req.body;
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    res.json({ message: "Review added/updated" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// TASK 9
app.delete('/auth/review/:isbn', verifyToken, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (books[isbn]?.reviews[username]) {
    delete books[isbn].reviews[username];
    res.json({ message: "Review deleted" });
  } else {
    res.status(404).json({ message: "Review not found" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
