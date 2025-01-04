




// const mongoose = require('mongoose');

// const batchSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
//     startDate: { type: Date, required: true },
//     endDate: { type: Date, required: true },
//     students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    
//     mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//     assignments: [
//       {
//         studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//         courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
//         score: { type: Number, default: null },
//         submission: { type: String }, // URL or file path
//       },
//     ],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Batch', batchSchema);



const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    progress: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        completedAssignments: { type: Number, default: 0 }, // Total assignments completed by the student
        totalScore: { type: Number, default: 0 }, // Total score accumulated by the student
        averageScore: { type: Number, default: 0 }, // Average score of the student
      },
    ],
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    assignments: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Student submitting the assignment
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Course related to the assignment
        score: { type: Number, default: null }, // Score for the assignment
        submission: { type: String }, // URL or file path of the submitted assignment
        feedback: { type: String, default: '' }, // Feedback from mentor or admin
        submittedAt: { type: Date, default: null }, // Timestamp of submission
      },
    ],
   
  },
  { timestamps: true }
);

module.exports = mongoose.model('Batch', batchSchema);
