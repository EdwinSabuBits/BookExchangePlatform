const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, deleteUser, forgotPassword, resetPassword, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.delete('/me', protect, deleteUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
