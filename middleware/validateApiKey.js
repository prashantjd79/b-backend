const ApiKey = require('../models/ApiKey');

exports.validateApiKey = async (req, res, next) => {
  try {
    // Extract the API key from headers
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      console.log('API key missing');
      return res.status(401).json({ message: 'API key is missing' });
    }

    // Check if the API key exists in the database and is not expired
    const key = await ApiKey.findOne({ key: apiKey, expiresAt: { $gt: new Date() } });
    if (!key) {
      console.log('Invalid or expired API key');
      return res.status(401).json({ message: 'Invalid or expired API key' });
    }

    // Log success
    console.log('API Key Validated:', key.key);

    next(); // Proceed to the next middleware or controller
  } catch (error) {
    console.error('Error validating API key:', error);
    return res.status(500).json({ message: 'Error validating API key' });
  }
};
