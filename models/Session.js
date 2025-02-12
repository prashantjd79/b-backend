const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  topic: { type: String, required: true },
  dateTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Session', sessionSchema);
