const mongoose = require('mongoose');

const pathSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true, // Ensures the name is unique
      trim: true // Removes unnecessary spaces
    }, 
    description: { type: String }, // Path Description
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to Category
    courses: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        batches: [
          {
            batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
            lessons: [
              {
                lessonId: { type: String }, // Unique lesson ID
                title: { type: String, required: true }, // Lesson Title
                type: { type: String, enum: ['Video', 'Document', 'Quiz'], required: true }, // Type of lesson
                url: { type: String }, // For Video or Document
                quiz: {
                  questions: [
                    {
                      question: { type: String, required: true }, // Quiz Question
                      options: [{ type: String, required: true }], // Multiple choice options
                      correctAnswer: { type: String, required: true }, // Correct answer for the question
                    },
                  ],
                },
              },
            ],
            assignments: [
              {
                assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true }, // Reference to Assignment
              },
            ],
          },
        ],
      },
    ],
    roadmapSuggestions: [{ type: String }], // Suggested steps or milestones
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Ensure that the name field is unique
pathSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Path', pathSchema);
