const express = require('express');
const pathController = require('../controllers/pathController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Admin-specific routes for managing paths
router.post('/create', protect(['Admin']), pathController.createPath);

// Get all paths
router.get('/', protect(['Admin', 'Manager', 'Mentor']), pathController.getPaths);

// Update a path
router.put('/update/:id', protect(['Admin']), pathController.updatePath);

// Delete a path
router.delete('/delete/:id', protect(['Admin']), pathController.deletePath);

module.exports = router;
