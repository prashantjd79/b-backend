const Path = require('../models/Path');
const Course = require('../models/Course');

// Create a new Path
exports.createPath = async (req, res) => {
  try {
    const { name, description, category, courses, roadmapSuggestions } = req.body;

    const path = new Path({
      name,
      description,
      category,
      courses,
      roadmapSuggestions,
    });

    await path.save();

    res.status(201).json({
      message: 'Path created successfully',
      path,
    });
  } catch (error) {
    console.error('Error creating path:', error.message);
    res.status(500).json({ error: 'Error creating path' });
  }
};



// Get all Paths
exports.getPaths = async (req, res) => {
  try {
    const paths = await Path.find()
      .populate('category', 'name')
      .populate('courses.courseId', 'title')
      .populate('courses.batches.batchId', 'name');

    res.status(200).json({
      message: 'Paths fetched successfully',
      paths,
    });
  } catch (error) {
    console.error('Error fetching paths:', error.message);
    res.status(500).json({ error: 'Error fetching paths' });
  }
};


// Get a specific Path by ID


// Update a Path
exports.updatePath = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedPath = await Path.findByIdAndUpdate(id, updates, { new: true })
      .populate('category', 'name')
      .populate('courses.courseId', 'title')
      .populate('courses.batches.batchId', 'name');

    if (!updatedPath) {
      return res.status(404).json({ message: 'Path not found' });
    }

    res.status(200).json({
      message: 'Path updated successfully',
      updatedPath,
    });
  } catch (error) {
    console.error('Error updating path:', error.message);
    res.status(500).json({ error: 'Error updating path' });
  }
};


// Delete a Path
exports.deletePath = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPath = await Path.findByIdAndDelete(id);

    if (!deletedPath) {
      return res.status(404).json({ message: 'Path not found' });
    }

    res.status(200).json({
      message: 'Path deleted successfully',
      deletedPath,
    });
  } catch (error) {
    console.error('Error deleting path:', error.message);
    res.status(500).json({ error: 'Error deleting path' });
  }
};


