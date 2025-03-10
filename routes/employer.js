const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const employerController = require('../controllers/employerController');

router.post('/create-job', protect(['Employer']), employerController.createJob);
router.get('/students', protect(['Employer']), employerController.getStudents);
//router.put('/applications', protect(['Employer']), employerController.updateApplicationStatus);
//router.get('/job/:jobId/applications', protect(['Employer']), employerController.getApplications);

router.post('/job/application/status', protect(['Employer']), employerController.updateApplicationStatus);
router.get('/job/:jobId/applications', protect(['Employer']), employerController.getJobApplications);
router.get('/jobs', protect(['Employer']), employerController.getEmployerJobs);


router.put('/jobs/:jobId', protect(['Employer']), employerController.updateJob);


router.delete('/jobs/:jobId', protect(['Employer']), employerController.deleteJob);

module.exports = router;
