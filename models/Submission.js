const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  quiz: {
    correctAnswers: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
  },
  assignment: {
    completed: { type: Boolean, default: false },
    submissionText: { type: String }, // Paragraph or text submitted
    submissionURL: { type: String }, // Supporting file or project URL
    reviewed: { type: Boolean, default: false }, // Whether it has been reviewed
    grade: { type: Number, min: 0, max: 100 }, // Grade assigned by the reviewer
    feedback: { type: String }, // Reviewer’s comments
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Submission', submissionSchema);
