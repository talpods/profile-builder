// jwtClient.js
const jwt = require('jsonwebtoken');

const generateToken = (payload, secret, options) => {
    return jwt.sign(payload, secret, options);
};

const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};

const decodeToken = (token, options) => {
    return jwt.decode(token, options);
};

module.exports = {
    generateToken,
    verifyToken,
    decodeToken
};
