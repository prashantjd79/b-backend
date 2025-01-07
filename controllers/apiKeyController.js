const crypto = require('crypto');
const ApiKey = require('../models/ApiKey');

exports.generateApiKey = async (req, res) => {
  try {
    const apiKey = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // Expire after 1 year

    const newApiKey = new ApiKey({
      key: apiKey,
      expiresAt,
    });

    await newApiKey.save();

    res.status(201).json({
      message: 'API key generated successfully',
      apiKey,
    });
  } catch (error) {
    console.error('Error generating API key:', error);
    res.status(500).json({ message: 'Error generating API key' });
  }
};
