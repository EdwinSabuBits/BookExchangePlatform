const express = require('express');
const router = express.Router();
const { addBook, getBooks, updateBook, deleteBook, getUserBooks, getBookById } = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addBook)
  .get(protect, getBooks);

router.route('/:id')
  .get(protect, getBookById)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

router.route('/user/:userId').get(protect, getUserBooks);

module.exports = router;
