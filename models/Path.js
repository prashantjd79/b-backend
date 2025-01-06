const mongoose = require('mongoose');

const pathSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Path Name
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
                lessonId: { type: String },
                title: { type: String },
                type: { type: String, enum: ['Video', 'Document', 'Quiz'], required: true },
                url: { type: String }, // For Video or Document
                quiz: {
                  questions: [
                    {
                      question: { type: String },
                      options: [{ type: String }],
                      correctAnswer: { type: String },
                    },
                  ],
                },
              },
            ],
            assignments: [
              {
                assignmentId: { type: String },
                title: { type: String },
                description: { type: String },
                dueDate: { type: Date },
              },
            ],
          },
        ],
      },
    ],
    roadmapSuggestions: [{ type: String }], // Suggested steps or milestones
  },
  { timestamps: true }
);

module.exports = mongoose.model('Path', pathSchema);
