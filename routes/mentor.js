const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const { protect } = require('../middleware/auth');

router.post('/schedule-session', protect(['Mentor','Admin']), mentorController.scheduleSession);

//router.post('/schedule-session', protect(['Admin','Mentor']), mentorController.scheduleSession);
router.post('/grade-assignment', protect(['Mentor']), mentorController.gradeAssignment);
// router.post('/create-assignment', protect(['Mentor']), mentorController.gradeAssignment);

router.post('/add-assignment', protect(['Admin']), mentorController.addAssignment);
router.get('/view-assignment/:submissionId', protect(['Admin','Mentor']), mentorController.getAssignmentSubmission);
router.post('/review-assignment',protect(['Mentor']), mentorController.reviewAssignment);
router.get('/submissions', protect(['Mentor']), mentorController.getAllSubmissions);


module.exports = router;
