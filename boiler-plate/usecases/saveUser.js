const userService = require('../services/userService');

async function saveUser(user) {
    await userService.saveUser(user);
}

module.exports = saveUser;