const express = require('express');
const { createPath, getPaths, getPathById, updatePath, deletePath } = require('../controllers/pathController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Admin-specific routes for managing paths
router.post('/', protect(['Admin']), createPath);
router.get('/', protect(['Admin', 'Student']), getPaths); // Allow students to view paths
router.get('/:id', protect(['Admin', 'Student']), getPathById);
router.put('/:id', protect(['Admin']), updatePath);
router.delete('/:id', protect(['Admin']), deletePath);

module.exports = router;
