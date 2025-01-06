
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
router.post('/approve-blog', protect(['Admin','Manager']), adminController.approveBlog);
router.post('/announcements', protect(['Admin']), adminController.createAnnouncement);
router.get('/announcements', protect(['Admin']), adminController.getAnnouncements);
router.put('/announcements/:id', protect(['Admin']), adminController.updateAnnouncement);
router.delete('/announcements/:id', protect(['Admin']),adminController.deleteAnnouncement);
router.post('/create-user', protect(['Admin']), adminController.createUser);
router.post('/create-course', protect(['Admin']), adminController.createCourse);
router.get('/courses', protect(['Admin','Mentor']), adminController.getCourses);
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



module.exports = router;



