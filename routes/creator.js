const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const creatorController = require('../controllers/creatorController');

router.post('/submit-blog', protect(['Creator']), creatorController.submitBlog);
router.post('/add-content', protect(['Creator']), creatorController.addContent);
router.get('/my-blogs', protect(['Creator']), creatorController.getMyBlogs);

module.exports = router;
