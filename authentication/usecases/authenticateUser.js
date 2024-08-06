//usecases/authenticateUser.js
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const tokenService = require('../services/tokenService');
const User = require('../entities/user');
const bcrypt = require('bcrypt');

async function authenticateUser(email, password) {
  let user = await userService.getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  user = new User(user)
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const accessToken = jwt.sign({ email: user.email, firstName: user.firstName, lastName: user.lastName, roles:user.roles, permissions:user.permissions }, process.env.JWT_SECRET, { expiresIn: '1d' });
  const refreshToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  await tokenService.storeTokens(accessToken, refreshToken);


  return { accessToken, refreshToken };
}

module.exports = authenticateUser;


