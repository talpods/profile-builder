const jwt = require('jsonwebtoken');
const TokenManager = require("../infrastructure/tokenManager");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const skHeader = req.headers.refreshtoken;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const  refreshToken  = skHeader;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token not provided' });
  }

  try {
    const isInvalid = await TokenManager.isTokenInvalidated(refreshToken);
    if (isInvalid) {
      return res.status(401).json({ error: 'Token is invalidated' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Access token is not valid' });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error('Error in authentication middleware:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = authenticate;
