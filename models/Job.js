const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  skillsRequired: [String],
  location: String,
  salary: String,
  status: { type: String, enum: ['Active', 'Closed'], default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  applications: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    },
  ],
  
});

module.exports = mongoose.model('Job', jobSchema);
