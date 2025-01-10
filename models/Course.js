const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    mentorAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    managerAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batchesAvailable: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
    promoCodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode' }],
    realPrice: { type: Number, required: true },
    discountedPrice: { type: Number },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }], // Array of Lesson IDs
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
