// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema({
//   studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
//   amount: { type: Number, required: true },
//   paymentDate: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Transaction', transactionSchema);


const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String },
  status: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Reference to Course
  paymentDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
