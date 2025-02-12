const passport = require('passport');
const router = require('express').Router();
const { protect } = require('../middleware/auth');
const studentController = require('../controllers/studentController');
const {applyToJob}=require('../controllers/studentController');



router.post('/enroll', protect(['Student']), studentController.enrollInCourse);
//router.post('/submit-assignment', protect(['Student']), studentController.submitAssignment);
// router.get('/progress', protect(['Student']), studentController.viewProgress);

router.post('/apply',protect(['Student']),applyToJob),
router.get('/progress', protect(['Student']), studentController.getStudentProgress);

router.post('/apply-promo', protect(['Student']), studentController.applyPromoCode);
router.post('/resume', protect(['Student']), studentController.updateResume);
router.get('/resume', protect(['Student']), studentController.getResume);
router.post('/apply-promo', protect(['Student']), studentController.applyPromoCode);
router.get('/courses',protect(['Student']),studentController.getCourses);
 router.get('/batches', protect(['Student']), studentController.getStudentBatches);
router.get('/batch/:batchId', protect(['Student']), studentController.getBatchDetails);
router.get('/transactions', protect(['Student']), studentController.getStudentTransactions);
router.get('/check-evoscore/:studentId', protect(['Student']), studentController.getEvoScore);

router.post('/submit-quiz-assignment', protect(['Student']), studentController.submitQuizAndAssignment);



// Authentication Routes

router.post('/signup', studentController.studentSignup);
router.post('/login', studentController.studentLogin);
router.get('/profile', protect(), studentController.getStudentProfile);
router.get('/enrolled', protect(['Student']), studentController.getEnrolledCourses);
router.post('/enroll-path', protect(['Student']), studentController.enrollInPath);
router.get('/enrolled-path', protect(['Student']), studentController.getEnrolledPath);
router.get("/batches", protect(["Student"]), studentController.getStudentBatches);
router.get("/jobs", protect(["Student"]), studentController.getAvailableJobs);


// Route to fetch enrolled courses & paths





// Route for submitting assignments
//router.post('/submit-assignment', studentController.submitAssignment);

// Route for submitting quizzes
//router.post('/submit-quiz', studentController.submitQuiz);

// Route for fetching EvoScore
//router.get('/:studentId/evo-score', studentController.getEvoScore);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.status(200).json({ message: 'Google Sign-In Successful', user: req.user });
  }
);

module.exports = router;


