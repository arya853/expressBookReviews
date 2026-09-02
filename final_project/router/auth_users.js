const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    user => user.username === username && user.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  return res.status(200).json({ message: "Login successful" });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { username, review } = req.body;

  if (!username || !review) {
    return res.status(400).json({
      message: "Username and review are required"
    });
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  book.reviews[username] = review;

  return res.status(200).json({
    message: "Review added/modified successfully",
    reviews: book.reviews
  });
});
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { username } = req.body;

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  if (!book.reviews[username]) {
    return res.status(404).json({
      message: "Review not found"
    });
  }

  delete book.reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
    reviews: book.reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
