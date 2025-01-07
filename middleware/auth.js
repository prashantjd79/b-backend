

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
const jwt = require('jsonwebtoken');

exports.protect = (roles = []) => async (req, res, next) => {
  try {
    // Log the Authorization header for debugging purposes
    console.log('Authorization Header:', req.headers.authorization);

    // Check if the Authorization header exists and is properly formatted
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
      console.log('No token provided or malformed Authorization header');
      return res.status(401).json({ message: 'Not authorized, token missing or invalid' });
    }

    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];
    console.log('Extracted Token:', token);

    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Debugging the decoded token payload

    // Attach the user information to the request object
    req.user = decoded;

    // Check if the user's role is allowed for this action
    if (roles.length > 0 && !roles.includes(decoded.role)) {
      console.log(`User role "${decoded.role}" is not authorized for this action`);
      return res.status(403).json({ message: 'Not authorized for this action' });
    }

    // If everything is fine, proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification errors
    console.error('Error in protect middleware:', error.message || error);

    // Respond with an appropriate error message
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      return res.status(500).json({ message: 'Internal server error' });
    }
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
