
// const jwt = require('jsonwebtoken');

// exports.protect = (roles = []) => async (req, res, next) => {
//   try {
//     // Log the Authorization header for debugging purposes
//     console.log('Authorization Header:', req.headers.authorization);

//     // Check if the Authorization header exists and is properly formatted
//     if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
//       console.log('No token provided or malformed Authorization header');
//       return res.status(401).json({ message: 'Not authorized, token missing or invalid' });
//     }

//     // Extract the token from the Authorization header
//     const token = req.headers.authorization.split(' ')[1];
//     console.log('Extracted Token:', token);

//     // Verify the token using the secret
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Decoded Token:', decoded); // Debugging the decoded token payload

//     // Attach the user information to the request object
//     req.user = decoded;

//     // Check if the user's role is allowed for this action
//     if (roles.length > 0 && !roles.includes(decoded.role)) {
//       console.log(`User role "${decoded.role}" is not authorized for this action`);
//       return res.status(403).json({ message: 'Not authorized for this action' });
//     }

//     // If everything is fine, proceed to the next middleware or route handler
//     next();
//   } catch (error) {
//     // Handle token verification errors
//     console.error('Error in protect middleware:', error.message || error);

//     // Respond with an appropriate error message
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: 'Token has expired' });
//     } else if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({ message: 'Invalid token' });
//     } else {
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//   }
// };



const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure correct path

exports.protect = (roles = []) => async (req, res, next) => {
  try {
    console.log("🔑 Authorization Header:", req.headers.authorization);

    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      console.error("❌ No token provided or malformed Authorization header");
      return res.status(401).json({ message: "Not authorized, token missing or invalid" });
    }

    // Extract token
    const token = req.headers.authorization.split(" ")[1];
    console.log("📌 Extracted Token:", token);

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);

    // Fetch user from database
    const user = await User.findById(decoded.userId).select("_id role name email");
    console.log("🔍 Found User in DB:", user);

    if (!user) {
      console.error("❌ User not found in database.");
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach user object to request
    req.user = user;

    // Role-based access control
    if (roles.length > 0 && !roles.includes(user.role)) {
      console.error(`🚫 Forbidden: User role "${user.role}" not authorized.`);
      return res.status(403).json({ message: "Not authorized for this action" });
    }

    console.log("✅ User authenticated, proceeding...");
    next();
  } catch (error) {
    console.error("❌ Error in protect middleware:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
