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
  transactionId: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  amountPaid: { type: Number, required: true },
  paymentDate: { type: Date, required: true },
  promoCodeApplied: { type: String },
});

module.exports = mongoose.model('Transaction', transactionSchema);
