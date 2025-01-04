const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const supportController = require('../controllers/supportController');

router.post('/create-ticket', protect(), supportController.createTicket);
router.get('/my-tickets', protect(), supportController.getMyTickets);

module.exports = router;
