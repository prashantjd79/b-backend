const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, default: null }, // Max times it can be used
  usedCount: { type: Number, default: 0 }, // Track usage
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null }, // Null means applicable to all courses
});

module.exports = mongoose.model('PromoCode', promoCodeSchema);
