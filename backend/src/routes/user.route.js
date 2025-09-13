const express = require('express');
const authHandler = require('../middleware/authHandler');
const {
  handleSignup,
  handleLogin,
  handleLogout,
  handleDelete,
  handleUser,
} = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/logout/:userId', authMiddleware, handleLogout);
router.delete('/delete/:userId', authMiddleware, handleDelete);
router.post('/user/me', authMiddleware, handleUser);
router.use(authHandler);
router.post('/signup', handleSignup);
router.post('/login', handleLogin);

module.exports = router;
