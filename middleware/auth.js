

// const jwt = require('jsonwebtoken');


// // Middleware to protect routes based on roles
// exports.protect = (roles) => (req, res, next) => {
//   try {
//     // Get token from the Authorization header
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: 'Not authorized' });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach user details (id, role) to the request

//     // Check if the user's role matches allowed roles for the route
//     if (roles && !roles.includes(req.user.role)) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     next(); // Proceed to the route handler
//   } catch (error) {
//     console.error('Token Error:', error.message);
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };
const jwt=require('jsonwebtoken');
exports.protect = (roles) => async (req, res, next) => {
  try {
    // Log the Authorization header
    console.log('Authorization Header:', req.headers.authorization);

    // Check if the Authorization header exists and starts with "Bearer"
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
      console.log('No token or malformed header');
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    // Extract the token
    const token = req.headers.authorization.split(' ')[1];
    console.log('Extracted Token:', token); // Debug the token

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Debug the decoded token

    req.user = decoded; // Attach user info to the request

    // Check if the role is allowed
    if (roles && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Not authorized for this action' });
    }

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error('Error in protect middleware:', error); // Debug any errors
    return res.status(401).json({ message: 'Token verification failed' });
  }
};


// exports.protect = (roles) => async (req, res, next) => {
//   try {
//     if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
//       return res.status(401).json({ message: 'Not authorized, no token provided' });
//     }

//     const token = req.headers.authorization.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;

//     const normalizedRoles = roles.map((role) => role.toLowerCase()); // Normalize roles
//     const userRole = decoded.role.toLowerCase(); // Normalize user's role

//     if (!normalizedRoles.includes(userRole)) {
//       console.error(`Role mismatch: User role (${decoded.role}) not in allowed roles (${roles})`);
//       return res.status(403).json({ message: 'Not authorized for this action' });
//     }

//     next();
//   } catch (error) {
//     console.error('Error in protect middleware:', error.message);
//     return res.status(401).json({ message: 'Token verification failed' });
//   }
// };
