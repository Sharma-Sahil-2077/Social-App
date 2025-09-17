const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {

  let token;

  if (
    
    req.headers.token
  ) {
    try {
      token = req.headers.token;
      console.log('tokennnnnnnnnnnnnnnn',token)
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
     
      
      // Attach user to request (without password)
      req.user = await User.findById(decoded.id).select('-password');
 console.log('user',req.user)
      next();

    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
