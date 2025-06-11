const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { registerUser, authenticateUser, users } = require('../users/auth');
const { verifyToken, secret } = require('../users/middleware');

// Simulated book database
const books = {
  "123456": {
    title: "Node.js Basics",
    author: "Kushagra Ojha",
    reviews: { user1: "Great book!" }
  },
  "789101": {
    title: "Express in Action",
    author: "John Doe",
    reviews: { user2: "Very useful." }
  }
};

// Task 1: Get all books
router.get('/', (req, res) => {
  res.json(books);
});

// Task 2: Get book by ISBN
router.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  res.json(books[isbn] || { error: "Book not found" });
});

// Task 3: Get books by author
router.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const filtered = Object.values(books).filter(
    book => book.author.toLowerCase() === author
  );
  res.json(filtered);
});

// Task 4: Get books by title
router.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const filtered = Object.values(books).filter(
    book => book.title.toLowerCase() === title
  );
  res.json(filtered);
});

// Task 5: Get book reviews
router.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

// ✅ Task 6: Register new user
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing username or password' });

  const success = registerUser(username, password);
  if (success) {
    res.status(200).json({ message: 'User registered successfully' });
  } else {
    res.status(400).json({ message: 'User already exists' });
  }
});

// ✅ Task 7: Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing username or password' });

  const valid = authenticateUser(username, password);
  if (valid) {
    const token = jwt.sign({ username }, secret, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// ✅ Task 8: Add or modify book review (authenticated)
router.put('/auth/review/:isbn', verifyToken, (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username;

  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

  books[isbn].reviews[username] = review;
  res.status(200).json({ message: "Review added/modified", reviews: books[isbn].reviews });
});

// ✅ Task 9: Delete book review (authenticated)
router.delete('/auth/review/:isbn', verifyToken, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    res.status(200).json({ message: "Review deleted" });
  } else {
    res.status(404).json({ message: "Review not found for this user" });
  }
});

module.exports = router;
