const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true }, // Promo Code
    discountPercentage: { type: Number, required: true }, // Discount Percentage
    expiryDate: { type: Date, required: true }, // Validity Period
    applicableTo: { 
      type: String, 
      enum: ['Category', 'Universal'], 
      required: true 
    }, // Applicable to (Category/Universal)
    usageLimit: { type: Number, required: true }, // Usage Limit (Once/Multiple)
    usedCount: { type: Number, default: 0 }, // Track the number of times it has been used
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false }, // Reference to Category (if applicable)
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('PromoCode', promoCodeSchema);
