

// const mongoose = require('mongoose');

// const announcementSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true }, // Announcement title
//     message: { type: String, required: true }, // Announcement message
//     media: { type: String }, // URL for images or video
//     targetAudience: [
//       {
//         type: String,
//         enum: ['Mentor', 'Manager', 'Creator', 'Students', 'Employers'],
//       },
//     ], // Target roles for the announcement
//     visibilityStart: { type: Date, required: true }, // Start of visibility period
//     visibilityEnd: { type: Date, required: true }, // End of visibility period
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who created the announcement
//   },
//   { timestamps: true } // Automatically adds createdAt and updatedAt
// );

// module.exports = mongoose.model('Announcement', announcementSchema);

const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Announcement title
    message: { type: String, required: true }, // Announcement message
    media: { type: String }, // Optional: URL for images or video
    targetAudience: [
      {
        type: String,
        enum: [
          'Mentor',
          'Manager',
          'Creator',
          'Student',
          'Students',
          'Employer',
          'Employers',
        ],
        required: true, // At least one target audience must be specified
      },
    ], // Target roles for the announcement
    visibilityStart: { type: Date, required: true }, // Start of visibility period
    visibilityEnd: { type: Date, required: true }, // End of visibility period
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin who created the announcement
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('Announcement', announcementSchema);
