const mongoose = require('mongoose');

const pathSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
  ],
  roadmap: [
    {
      suggestion: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Path', pathSchema);
