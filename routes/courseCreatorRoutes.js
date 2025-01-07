const express = require('express');
const router = express.Router();
const courseCreatorController = require('../controllers/courseCreatorController');
const { protect } = require('../middleware/auth');
const { validateApiKey } = require('../middleware/validateApiKey');
// Protect all routes for Course Creator role
router.post('/create-course', validateApiKey, courseCreatorController.createCourse);
router.put('/update-course/:courseId', protect(['CourseCreator']), courseCreatorController.updateCourse);
router.delete('/delete-course/:courseId', protect(['CourseCreator']), courseCreatorController.deleteCourse);
router.get('/my-courses', protect(['CourseCreator']), courseCreatorController.getCourses);

module.exports = router;
