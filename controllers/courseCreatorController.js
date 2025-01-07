const Course = require('../models/Course');

// Create Course



exports.createCourse = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subcategory,
      duration,
      realPrice,
      discountedPrice,
      lessons,
      mentorAssigned,
      managerAssigned,
      batchesAvailable,
      promoCodes,
    } = req.body;

    // Create a new course
    const course = new Course({
      name,
      description,
      category,
      subcategory,
      duration,
      realPrice,
      discountedPrice,
      lessons,
      mentorAssigned,
      managerAssigned,
      batchesAvailable,
      promoCodes,
    });

    await course.save();

    res.status(201).json({
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    console.error('Error creating course:', error.message);
    res.status(500).json({
      message: 'Error creating course',
      error: error.message,
    });
  }
};

// Update Course
exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const updates = req.body;

    const course = await Course.findOneAndUpdate(
      { _id: courseId, creatorId: req.user.id }, // Ensure the course belongs to the creator
      updates,
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found or not authorized' });
    }

    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

// Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOneAndDelete({ _id: courseId, creatorId: req.user.id }); // Ensure the course belongs to the creator

    if (!course) {
      return res.status(404).json({ message: 'Course not found or not authorized' });
    }

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

// Get Courses by Creator
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ creatorId: req.user.id }).populate('categoryId').populate('subcategoryId');
    res.status(200).json({ message: 'Courses fetched successfully', courses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};
