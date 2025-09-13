const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const validateUrlRequest = require('../middleware/validateUrlRequest');
const {
  handleGetURL,
  handleCreateURL,
  handleUpdateURL,
  handleDeleteURL,
} = require('../controllers/url.contoller');
const router = express.Router();

router.use(authMiddleware);
router.use(validateUrlRequest);

router.get('/', handleGetURL);
router.post('/', handleCreateURL);
router.put('/', handleUpdateURL);
router.delete('/', handleDeleteURL);

module.exports = router;
