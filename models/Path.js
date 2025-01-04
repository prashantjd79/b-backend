const mongoose = require('mongoose');

const pathSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // List of courses in the path
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Path', pathSchema);
