const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Assignment title
    description: { type: String, required: true }, // Assignment description
    submissionURL: { type: String }, // Optional submission URL
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true }, // Reference to the Lesson
    createdAt: { type: Date, default: Date.now }, // Timestamp for creation
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
