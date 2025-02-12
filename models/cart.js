const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  items: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to the Course model (optional)
      },
      path: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Path', // Reference to the Path model (optional)
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);
