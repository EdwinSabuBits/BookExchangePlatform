const Book = require('../models/bookModel');
const User = require('../models/userModel');

const createBook = async ({ userId, title, author, genre, condition, availabilityStatus, location }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  const book = new Book({
    user: userId,
    title,
    author,
    genre,
    condition,
    availabilityStatus: availabilityStatus === false ? false : true,
    location: location || user.location,
  });
  
  const createdBook = await book.save();
  user.books.push(createdBook._id);
  await user.save();
  
  return createdBook;
};

const deleteBooksByUserId = async (userId) => {
    await Book.deleteMany({ user: userId });
  };

const getAllBooks = async (page, pageSize, keyword) => {
  const searchKeyword = keyword ? {
    $or: [
      { title: { $regex: keyword, $options: 'i' } },
      { author: { $regex: keyword, $options: 'i' } },
      { genre: { $regex: keyword, $options: 'i' } },
    ],
  } : {};

  const count = await Book.countDocuments({ ...searchKeyword });
  const books = await Book.find({ ...searchKeyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  return { books, page, pages: Math.ceil(count / pageSize) };
};

const getBooksByUser = async (userId, page, pageSize) => {
  const count = await Book.countDocuments({ user: userId });
  const books = await Book.find({ user: userId })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  
  return { books, page, pages: Math.ceil(count / pageSize) };
};

const updateBook = async (bookId, userId, updateData) => {
  const book = await Book.findById(bookId);
  if (!book) {
    throw new Error('Book not found');
  }
  
  if (book.user.toString() !== userId.toString()    ) {
    throw new Error('User not authorized to update this book');
  }
  
  book.title = updateData.title || book.title;
  book.author = updateData.author || book.author;
  book.genre = updateData.genre || book.genre;
  book.condition = updateData.condition || book.condition;
  book.availabilityStatus = updateData.availabilityStatus !== undefined ? updateData.availabilityStatus : book.availabilityStatus;
  book.location = updateData.location || book.location;
  
  const updatedBook = await book.save();
  return updatedBook;
};

const deleteBook = async (bookId, userId) => {
  const book = await Book.findById(bookId);
  if (!book) {
    throw new Error('Book not found');
  }
  
  if (book.user.toString() !== userId.toString()) {
    throw new Error('User not authorized to delete this book');
  }
  
  await Book.deleteOne({ _id: bookId });
  return { message: 'Book removed' };
};

const getBookById = async (id) => {
  const book = await Book.findById(id);
  if (!book) {
    throw new Error('Book not found');
  }
  return book;
};

module.exports = {
  createBook,
  deleteBooksByUserId,
  getAllBooks,
  getBooksByUser,
  updateBook,
  deleteBook,
  getBookById
};
