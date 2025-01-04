


const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { addAnnouncement, getAnnouncements } = require('../controllers/adminController');

// Only Admins can approve blogs
router.post('/approve-blog', protect(['Admin','Manager']), adminController.approveBlog);
router.post('/announcement', protect(['Admin']), addAnnouncement);
router.get('/announcements', protect(['Admin', 'Mentor', 'Manager', 'Creator', 'Student', 'Employer']), getAnnouncements);
// Admins and Managers can view analytics




//router.get('/analytics', protect(['Admin', 'Manager']), adminController.viewAnalytics);





// Only Admins can create a user
router.post('/create-user', protect(['Admin']), adminController.createUser);

// Only Admins can create a course
router.post('/create-course', protect(['Admin']), adminController.createCourse);
router.get('/courses', protect(['Admin','Mentor']), adminController.getCourses);




router.post('/create-mentor', protect(['Admin']), adminController.createMentor);
router.get('/mentor',protect(['Admin',]),adminController.getMentors);

// creating Batch
router.post('/create-batch', protect(['Admin']), adminController.createBatch);

router.post('/assign-course', protect(['Admin']), adminController.assignCourse);

router.get('/users', protect(['Admin']), adminController.getUsers);

router.put('/assign-mentor', protect(['Admin']), adminController.assignMentorToBatch);

router.put('/assign-students', protect(['Admin']), adminController.assignStudents);
router.get('/batches', protect(['Admin','Mentor']), adminController.getBatches);

router.put('/approve-blog', protect(['Admin']), adminController.approveBlog);
router.get('/blogs', protect(['Admin']), adminController.getPendingBlogs);


router.get('/analytics', protect(['Admin','Manager']), adminController.getAnalytics);
router.post('/simulate-transaction', adminController.simulateTransaction);

router.get('/export-transactions', protect(['Admin']), adminController.exportTransactions);

router.post('/create-category', protect(['Admin']), adminController.createCategory);
router.post('/create-subcategory', protect(['Admin']), adminController.createSubcategory);

router.post('/create-promo', protect(['Admin']), adminController.createPromoCode);
router.get('/promo-codes', protect(['Admin']), adminController.getPromoCodes);
router.get('/categories', protect(['Admin']), adminController.getCategories);
router.get('/subcategories', protect(['Admin']), adminController.getSubcategories);

router.get('/students', protect(['Admin', 'Mentor']), adminController.getStudents);

// Login route (No role restrictions)
router.post('/login', adminController.login);


router.post('/create-manager', protect(['Admin']), adminController.createManager);

// Get All Managers
router.get('/managers', protect(['Admin']), adminController.getManagers);

// Update Manager
router.put('/update-manager/:id', protect(['Admin']), adminController.updateManager);

// Delete Manager
router.delete('/delete-manager/:id', protect(['Admin']), adminController.deleteManager);


module.exports = router;



