const asyncHandler = require('express-async-handler');
const Book = require('../models/bookModel');
const User = require('../models/userModel');

// @desc    Add a book
// @route   POST /api/books
// @access  Private
const addBook = asyncHandler(async (req, res) => {
  const { title, author, genre, condition, availabilityStatus, location } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const book = new Book({
    user: req.user._id,
    title,
    author,
    genre,
    condition,
    availabilityStatus: availabilityStatus === false ? false : true, // default to true if not provided
    location: location || user.location, // default to user's location if not provided
  });

  const createdBook = await book.save();
  res.status(201).json(createdBook);
});

// @desc    Get all books with pagination and search
// @route   GET /api/books
// @access  Private
const getBooks = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          $or: [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { author: { $regex: req.query.keyword, $options: 'i' } },
            { genre: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};
  
    const count = await Book.countDocuments({ ...keyword });
    const books = await Book.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  
    res.json({ books, page, pages: Math.ceil(count / pageSize) });
  });  

// @desc    Get books by user with pagination
// @route   GET /api/books/user/:userId
// @access  Private
const getUserBooks = asyncHandler(async (req, res) => {
  const pageSize = 2;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Book.countDocuments({ user: req.params.userId });
  const books = await Book.find({ user: req.params.userId })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ books, page, pages: Math.ceil(count / pageSize) });
});


// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = asyncHandler(async (req, res) => {
  const { title, author, genre, condition, availabilityStatus, location } = req.body;

  const book = await Book.findById(req.params.id);

  if (book) {
    // Check if the user owns the book
    if (book.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to update this book');
    }
    
    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.condition = condition || book.condition;
    book.availabilityStatus = availabilityStatus !== undefined ? availabilityStatus : book.availabilityStatus;

    // Update location if provided, otherwise keep the existing location
    book.location = location || book.location;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});


// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
  
    if (book) {
      // Check if the user owns the book
      if (book.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized to delete this book');
      }
      await Book.deleteOne({ _id: req.params.id });
      res.json({ message: 'Book removed' });
    } else {
      res.status(404);
      throw new Error('Book not found');
    }
  });
  
module.exports = { addBook, getBooks, updateBook, deleteBook, getUserBooks };
