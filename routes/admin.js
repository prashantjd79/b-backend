
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { validateApiKey } = require('../middleware/validateApiKey');

// Apply the API key middleware for all admin routes
router.use(validateApiKey);
router.post('/approve-blog', protect(['Admin','Manager']), adminController.approveBlog);
router.post('/announcements', protect(['Admin']), adminController.createAnnouncement);

router.get('/announcements', protect(['Admin']), adminController.getAnnouncements);
router.put('/announcements/:id', protect(['Admin']), adminController.updateAnnouncement);
router.delete('/announcements/:id', protect(['Admin']),adminController.deleteAnnouncement);
router.post('/create-user', protect(['Admin']), adminController.createUser);

//router.get('/courses', protect(['Admin']), adminController.getCourses);

//router.delete('/delete-course/:id', protect(['Admin']), adminController.deleteCourse);
//router.post('/create-batch', protect(['Admin']), adminController.createBatch);
router.post('/assign-course', protect(['Admin']), adminController.assignCourse);
router.get('/users', protect(['Admin']), adminController.getUsers);
router.put('/assign-mentor', protect(['Admin']), adminController.assignMentorToBatch);
router.put('/assign-students', protect(['Admin']), adminController.assignStudents);
//router.get('/batches', protect(['Admin','Mentor']), adminController.getBatches);
router.put('/approve-blog', protect(['Admin']), adminController.approveBlog);
router.get('/blogs', protect(['Admin']), adminController.getPendingBlogs);
router.get('/analytics', protect(['Admin','Manager']), adminController.getAnalytics);
router.post('/simulate-transaction', adminController.simulateTransaction);
//router.get('/export-transactions', protect(['Admin']), adminController.exportTransactions);
router.post('/create-category', protect(['Admin']), adminController.createCategory);
router.post('/create-subcategory', protect(['Admin']), adminController.createSubcategory);
router.post('/promo-codes', protect(['Admin']), adminController.createPromoCode);
router.get('/promo-codes', protect(['Admin']), adminController.getPromoCodes);
router.put('/promo-codes/:id', protect(['Admin']), adminController.updatePromoCode);
router.delete('/promo-codes/:id', protect(['Admin']), adminController.deletePromoCode);
router.get('/categories', protect(['Admin']), adminController.getCategories);
router.get('/subcategories', protect(['Admin']), adminController.getSubcategories);
router.get('/students', protect(['Admin', 'Mentor']), adminController.getStudents);
router.post('/login', adminController.login);
router.post('/create-manager', protect(['Admin']), adminController.createManager);
router.get('/managers', protect(['Admin']), adminController.getManagers);
router.put('/update-manager/:id', protect(['Admin']), adminController.updateManager);
router.delete('/delete-manager/:id', protect(['Admin']), adminController.deleteManager);
router.post("/create-mentor", protect(["Admin"]), adminController.createMentor);
router.get("/mentors", protect(["Admin"]),adminController.getMentors);
router.put("/update-mentor/:id", protect(["Admin"]),adminController.updateMentor);
router.delete("/delete-mentor/:id", protect(["Admin"]),adminController.deleteMentor);
router.post('/create-creator', protect(['Admin']), adminController.createCreator);
router.get('/creators', protect(['Admin']), adminController.getCreators);
router.put('/update-creator/:id', protect(['Admin']), adminController.updateCreator);
router.delete('/delete-creator/:id', protect(['Admin']), adminController.deleteCreator);
router.post('/create-student', protect(['Admin']), adminController.createStudent);
router.get('/students', protect(['Admin']), adminController.getStudents);
router.put('/update-student/:id', protect(['Admin']), adminController.updateStudent);
router.delete('/delete-student/:id', protect(['Admin']), adminController.deleteStudent);
router.post('/create-employer', protect(['Admin']), adminController.createEmployer);
router.put('/update-employer/:id', protect(['Admin']), adminController.updateEmployer);
router.get('/employers', protect(['Admin']), adminController.getEmployers);
router.delete('/delete-employer/:id', protect(['Admin']), adminController.deleteEmployer);
router.get('/transactions', protect(['Admin']), adminController.getTransactions);
// Create a new batch
router.post('/batch/create', protect(['Admin']), adminController.createBatch);
router.get('/batch', protect(['Admin']), adminController.getBatches);
router.put('/batch/update/:id', protect(['Admin']), adminController.updateBatch);
router.delete('/batch/delete/:id', protect(['Admin']), adminController.deleteBatch);
//router.post('/create-lesson', protect(['Admin']), adminController.createLesson);

router.get('/course/:courseId', protect(['Admin','Mentor']), adminController.getCourseWithLessons);

// Create a lesson
router.post('/create-lesson', protect(['Admin']),adminController.createLesson);

// Update a lesson
router.put('/update-lesson', protect(['Admin']),adminController.updateLesson);

// Delete a lesson
router.delete('/delete-lesson', protect(['Admin']), adminController.deleteLesson);
router.put('/update-quiz-or-assignment', protect(['Admin',' Mentor']),adminController.updateQuizOrAssignment);
router.delete('/delete-quiz-or-assignment', protect(['Admin','Mentor']), adminController.deleteQuizOrAssignment);
router.post('/get-quiz-assignment-count', protect(['Admin']),adminController.getQuizAndAssignmentCount);
router.post('/add-quiz-or-assignment', protect(['Admin','Mentor']), adminController.addQuizOrAssignment);
router.get("/quiz/:quizId", adminController.getQuizById);

// Update a course
router.post('/create-course', protect(['Admin']), adminController.createCourse);
router.put('/update-course', protect(['Admin']), adminController.updateCourse);
// Get a particular course
router.get('/course/:courseId',  adminController.getCourse);

// Delete a course
router.delete('/course/:courseId', protect(['Admin']), adminController.deleteCourse);


router.post('/create-path', protect(['Admin']), adminController.createPath);
router.get('/path/:pathId',  adminController.getPath);
router.put('/update-path', protect(['Admin']), adminController.updatePath);
router.delete('/path/:pathId', protect(['Admin']), adminController.deletePath);
router.get('/courses',  adminController.getAllCourses);
router.put('/pause-user/:userId', protect(['Admin']), adminController.pauseUser);
router.delete('/delete-user/:userId', protect(['Admin']), adminController.deleteUser);


module.exports = router;



