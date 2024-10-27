const asyncHandler = require('express-async-handler');
const bookService = require('../services/bookService');

// @desc    Add a book
// @route   POST /api/books
// @access  Private
const addBook = asyncHandler(async (req, res) => {
  const { title, author, genre, condition, availabilityStatus, location } = req.body;

  const createdBook = await bookService.createBook({
    userId: req.user._id,
    title,
    author,
    genre,
    condition,
    availabilityStatus,
    location,
  });

  res.status(201).json(createdBook);
});

// @desc    Get all books with pagination and search
// @route   GET /api/books
// @access  Private
const getBooks = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const currentPage = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword || '';

  const { books, page, pages } = await bookService.getAllBooks(currentPage, pageSize, keyword);

  res.json({ books, page, pages });
});

// @desc    Get books by user with pagination
// @route   GET /api/books/user/:userId
// @access  Private
const getUserBooks = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const currentPage = Number(req.query.pageNumber) || 1;

  const { books, page, pages } = await bookService.getBooksByUser(req.params.userId, currentPage, pageSize);

  res.json({ books, page, pages });
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = asyncHandler(async (req, res) => {
  const { title, author, genre, condition, availabilityStatus, location } = req.body;

  try {
    const updatedBook = await bookService.updateBook(req.params.id, req.user._id, {
      title,
      author,
      genre,
      condition,
      availabilityStatus,
      location,
    });

    res.json(updatedBook);
  } catch (error) {
    if (error.message === 'User not authorized to update this book') {
      res.status(401);
      res.json({ message: 'User not authorized to update this book' });
    } else if (error.message === 'Book not found') {
      res.status(404);
      res.json({ message: 'Book not found' });
    } else {
      res.status(500);
      res.json({ message: error.message });
    }
  }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = asyncHandler(async (req, res) => {
  try {
    const result = await bookService.deleteBook(req.params.id, req.user._id);
    res.json(result);
  } catch (error) {
    if (error.message === 'User not authorized to delete this book') {
      res.status(401);
      res.json({ message: 'User not authorized to delete this book' });
    } else if (error.message === 'Book not found') {
      res.status(404);
      res.json({ message: 'Book not found' });
    } else {
      res.status(500);
      res.json({ message: error.message });
    }
  }
});

module.exports = { addBook, getBooks, updateBook, deleteBook, getUserBooks };
