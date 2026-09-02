const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: "User registered successfully"
  });
});

// Get all books using async/await and Promise
public_users.get("/", async (req, res) => {
  try {
    const getAllBooks = () => Promise.resolve(books);
    const result = await getAllBooks();

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books",
      error: error.message
    });
  }
});

// Get book by ISBN using Promise callback
public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;

  const getBookByISBN = new Promise((resolve, reject) => {
    const book = books[isbn];

    if (book) {
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  });

  getBookByISBN
    .then(book => {
      res.status(200).json(book);
    })
    .catch(error => {
      res.status(404).json({
        message: error.message
      });
    });
});

// Get books by author using async/await
public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;

  try {
    const getBooksByAuthor = () => {
      return new Promise(resolve => {
        const result = Object.values(books).filter(
          book => book.author.toLowerCase() === author.toLowerCase()
        );

        resolve(result);
      });
    };

    const result = await getBooksByAuthor();

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books by author",
      error: error.message
    });
  }
});

// Get books by title using async/await
public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title;

  try {
    const getBooksByTitle = () => {
      return new Promise(resolve => {
        const result = Object.values(books).filter(
          book => book.title.toLowerCase() === title.toLowerCase()
        );

        resolve(result);
      });
    };

    const result = await getBooksByTitle();

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books by title",
      error: error.message
    });
  }
});

// Get book reviews
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});

module.exports.general = public_users;
