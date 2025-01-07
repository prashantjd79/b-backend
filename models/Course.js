

// const mongoose = require('mongoose');

// // Define the Course schema
// const courseSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   category: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   subcategory: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   description: {
//     type: String,
//     trim: true,
//   },
//   price: { type: Number, required: true },

//   categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

//   subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },

//   content: [
//     {
//       type: { type: String, enum: ['Video', 'Document', 'Quiz'], required: true },
//       title: { type: String, required: true },
//       url: { type: String }, // For videos or documents
//       quiz: {
//         questions: [
//           {
//             question: String,
//             options: [String],
//             correctAnswer: String,
//           },
//         ],
//       },
//     },
//   ],
  
//   createdAt: {
//     type: Date,
//     default: Date.now, // Automatically sets the creation date
//   },
// });

// // Export the Course model
// module.exports = mongoose.model('Course', courseSchema);
// const mongoose = require('mongoose');

// const courseSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true }, // Course name
//     category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to category
//     subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true }, // Reference to subcategory
//     description: { type: String, required: true }, // Course description
//     duration: { type: String, required: true }, // Duration of the course
//     mentorAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to mentor
//     managerAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to manager
//     batchesAvailable: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }], // Reference to batches (optional)
//     promoCodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode' }], // Reference to promo codes (optional)
//     realPrice: { type: Number, required: true }, // Real price of the course
//     discountedPrice: { type: Number }, // Discounted price (if applicable)
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Course', courseSchema);
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Course Name
    description: { type: String, required: true }, // Course Description
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Category ID
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true }, // Subcategory ID
    duration: { type: String, required: true }, // Duration (e.g., "4 weeks")
    realPrice: { type: Number, required: true }, // Real Price
    discountedPrice: { type: Number }, // Discounted Price

    lessons: [
      {
        title: { type: String, required: true }, // Lesson Title
        description: { type: String }, // Lesson Description
        videos: [
          {
            title: { type: String, required: true }, // Video Title
            videoURL: { type: String, required: true }, // Video URL
            content: { type: String }, // Additional Content for Video
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

    mentorAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Mentor Assigned
    managerAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Manager Assigned
    batchesAvailable: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }], // Batches
    promoCodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode' }], // Promo Codes
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
