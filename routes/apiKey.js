const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKeyController');

// POST route for generating API key
router.post('/generate', apiKeyController.generateApiKey);

module.exports = router;
