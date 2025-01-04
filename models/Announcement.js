// const mongoose = require('mongoose');

// const AnnouncementSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   message: { type: String, required: true },
//   targetRoles: [{ type: String, enum: ['Mentor', 'Student', 'Employer', 'Manager', 'Creator'], required: true }],
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// });

// module.exports = mongoose.model('Announcement', AnnouncementSchema);


const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    targetRoles: { type: [String], required: true }, // Array of roles
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const Announcement = mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;
