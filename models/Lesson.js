const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const lessonSchema = new mongoose.Schema(
  {
    lessonId: { type: String, default: () => uuidv4(), unique: true }, // Auto-generated unique lesson ID
    title: { type: String, required: true }, // Lesson title
    description: { type: String, required: true }, // Lesson description
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Reference to Course
    videos: [
      {
        videoTitle: { type: String, required: true }, // Video title
        videoURL: { type: String, required: true }, // Video URL
        content: { type: String }, // Additional content for the video
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', lessonSchema);
