const express = require("express");
const axios = require("axios");

let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();

// ===============================
// TASK 6 - REGISTER USER
// ===============================
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

  users.push({
    username: username,
    password: password
  });

  return res.status(201).json({
    message: "User registered successfully"
  });
});


// ===============================
// TASK 1 - GET ALL BOOKS
// ===============================
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});


// ===============================
// TASK 2 - GET BOOK BY ISBN
// ===============================
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});


// ===============================
// TASK 3 - GET BOOKS BY AUTHOR
// ===============================
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  const result = Object.values(books).filter(
    book => book.author.toLowerCase() === author.toLowerCase()
  );

  return res.status(200).json(result);
});


// ===============================
// TASK 4 - GET BOOKS BY TITLE
// ===============================
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  const result = Object.values(books).filter(
    book => book.title.toLowerCase() === title.toLowerCase()
  );

  return res.status(200).json(result);
});


// ===============================
// TASK 5 - GET BOOK REVIEWS
// ===============================
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});


// =====================================================
// TASK 10 - GET ALL BOOKS USING ASYNC/AWAIT + AXIOS
// =====================================================
public_users.get("/async/books", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books"
    });
  }
});


// =====================================================
// TASK 11 - GET BOOK BY ISBN USING PROMISE + AXIOS
// =====================================================
public_users.get("/async/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  axios
    .get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      return res.status(404).json({
        message: "Book not found"
      });
    });
});


// =====================================================
// TASK 12 - GET BOOKS BY AUTHOR USING ASYNC/AWAIT + AXIOS
// =====================================================
public_users.get("/async/author/:author", async (req, res) => {
  const author = req.params.author;

  try {
    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({
      message: "Books not found for this author"
    });
  }
});


// =====================================================
// TASK 13 - GET BOOKS BY TITLE USING ASYNC/AWAIT + AXIOS
// =====================================================
public_users.get("/async/title/:title", async (req, res) => {
  const title = req.params.title;

  try {
    const response = await axios.get(
      `http://localhost:5000/title/${encodeURIComponent(title)}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({
      message: "Books not found for this title"
    });
  }
});


module.exports.general = public_users;
