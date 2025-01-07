const ApiKey = require('../models/ApiKey');
const crypto = require('crypto');

exports.generateApiKey = async (req, res) => {
  try {
    // Generate a unique API key
    const apiKey = crypto.randomBytes(32).toString('hex');

    // Save the key in the database
    const newApiKey = new ApiKey({ key: apiKey });
    await newApiKey.save();

    res.status(201).json({ message: 'API key generated successfully', apiKey });
  } catch (error) {
    console.error('Error generating API key:', error);
    res.status(500).json({ message: 'Error generating API key' });
  }
};
