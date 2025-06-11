const jwt = require('jsonwebtoken');
const secret = 'your-secret-key'; // You can use dotenv for production

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'Token required' });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

module.exports = { verifyToken, secret };
