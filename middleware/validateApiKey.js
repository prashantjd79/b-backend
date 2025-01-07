const ApiKey = require('../models/ApiKey');

// Middleware to validate API keys
exports.validateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ message: 'API key is missing' });
    }

    // Check if the API key exists and is not expired
    const key = await ApiKey.findOne({ key: apiKey, expiresAt: { $gt: new Date() } });

    if (!key) {
      return res.status(401).json({ message: 'Invalid or expired API key' });
    }

    next(); // API key is valid, proceed to the next middleware
  } catch (error) {
    console.error('Error validating API key:', error);
    res.status(500).json({ message: 'Error validating API key' });
  }
};
