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

// @desc    Get books by user
// @route   GET /api/books/user/:userId
// @access  Private
const getUserBooks = asyncHandler(async (req, res) => {
  const { books } = await bookService.getBooksByUser(req.params.userId);
  res.json({ books });
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

// @desc    Get book by ID
// @route   GET /api/books/:id
// @access  Private
const getBookById = asyncHandler(async (req, res) => {
  const book = await bookService.getBookById(req.params.id);

  if (book) {
    res.json(book);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

module.exports = { addBook, getBooks, updateBook, deleteBook, getUserBooks, getBookById };
