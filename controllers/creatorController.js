const Blog = require('../models/Blog');
const Course = require('../models/Course');

exports.submitBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      creatorId: req.user.id,
    });

    await blog.save();
    res.status(201).json({ message: 'Blog submitted successfully', blog });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting blog' });
  }
};


exports.addContent = async (req, res) => {
  try {
    const { courseId, type, title, url, quiz } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.content.push({ type, title, url, quiz });
    await course.save();

    res.status(200).json({ message: 'Content added successfully', content: course.content });
  } catch (error) {
    res.status(500).json({ error: 'Error adding content' });
  }
};
exports.getMyBlogs = async (req, res) => {
    try {
      const blogs = await Blog.find({ creatorId: req.user.id });
      res.status(200).json({ message: 'Blogs retrieved successfully', blogs });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching blogs' });
    }
  };
  
