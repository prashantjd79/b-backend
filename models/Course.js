

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
const mongoose = require('mongoose');

// Define the Course schema
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: { 
    type: Number, 
    required: true 
  },
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  subcategoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subcategory', 
    required: true 
  },
  content: [
    {
      type: { 
        type: String, 
        enum: ['Video', 'Document', 'Quiz'], 
        required: true 
      },
      title: { 
        type: String, 
        required: true 
      },
      url: { 
        type: String 
      }, // For videos or documents
      quiz: {
        questions: [
          {
            question: String,
            options: [String],
            correctAnswer: String,
          },
        ],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the creation date
  },
});

// Export the Course model
module.exports = mongoose.model('Course', courseSchema);