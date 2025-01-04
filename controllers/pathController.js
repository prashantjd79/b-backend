const Path = require('../models/Path');
const Course = require('../models/Course');

// Create a new Path
exports.createPath = async (req, res) => {
  try {
    const { name, description, courses } = req.body;

    const path = new Path({
      name,
      description,
      courses,
    });

    await path.save();
    res.status(201).json({ message: 'Path created successfully', path });
  } catch (error) {
    res.status(500).json({ error: 'Error creating path' });
  }
};

// Get all Paths
exports.getPaths = async (req, res) => {
  try {
    const paths = await Path.find().populate('courses', 'title description price');
    res.status(200).json({ paths });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching paths' });
  }
};

// Get a specific Path by ID
exports.getPathById = async (req, res) => {
  try {
    const { id } = req.params;
    const path = await Path.findById(id).populate('courses', 'title description price');
    if (!path) return res.status(404).json({ message: 'Path not found' });
    res.status(200).json({ path });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching path' });
  }
};

// Update a Path
exports.updatePath = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, courses } = req.body;

    const path = await Path.findByIdAndUpdate(
      id,
      { name, description, courses },
      { new: true }
    );

    if (!path) return res.status(404).json({ message: 'Path not found' });
    res.status(200).json({ message: 'Path updated successfully', path });
  } catch (error) {
    res.status(500).json({ error: 'Error updating path' });
  }
};

// Delete a Path
exports.deletePath = async (req, res) => {
  try {
    const { id } = req.params;

    const path = await Path.findByIdAndDelete(id);

    if (!path) return res.status(404).json({ message: 'Path not found' });
    res.status(200).json({ message: 'Path deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting path' });
  }
};
