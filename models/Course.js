const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    mentorAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    managerAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batchesAvailable: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
    promoCodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode' }],
    realPrice: { type: Number, required: true },
    discountedPrice: { type: Number },
    lessons: [
      {
        title: { type: String, required: true }, // Lesson Title
        description: { type: String }, // Lesson Description
        videos: [
          {
            title: { type: String, required: true }, // Video Title
            videoURL: { type: String, required: true }, // Video URL
          },
        ],
        quizzes: [
          {
            question: { type: String, required: true }, // Quiz Question
            options: [{ type: String, required: true }], // Quiz Options
            correctAnswer: { type: String, required: true }, // Correct Answer
          },
        ],
        assignments: [
          {
            title: { type: String, required: true }, // Assignment Title
            description: { type: String }, // Assignment Description
            submissionURL: { type: String }, // Submission URL
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
