const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  }

  return res.status(404).json({message: "Book not found"});
});
  
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const result = Object.values(books).filter(
    book => book.author.toLowerCase() === author.toLowerCase()
  );

  return res.status(200).json(result);
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const result = Object.values(books).filter(
    book => book.title.toLowerCase() === title.toLowerCase()
  );

  return res.status(200).json(result);
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  }

  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
