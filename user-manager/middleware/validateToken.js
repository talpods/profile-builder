const axios = require('axios');
const authServiceUrl = process.env.VALIDATE_URL;
const validateToken = async (req, res, next) => {
  try {
    // Extract the token from the request headers
    const token = req.headers.authorization.split(' ')[1];
    const refreshToken  = req.headers.refreshtoken;
    
    // Make the request to the validate endpoint
    const response = await axios.get(authServiceUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
            refreshToken: refreshToken
        }
    });
    // Handle the response
    if (response.status === 200) {
      req.user = response.data;
      next();
    } else {
      throw new Error('Token validation failed');
    }
  } catch (error) {
    // Handle specific error cases
    if (error.response && error.response.status === 401) {
      res.status(401).json({ message: 'Unauthorized: Token is not valid or not provided' });
    } else {
      res.status(500).json({ message: 'Error validating token: ' + error.message });
    }
  }
};

module.exports = validateToken;
