const userService = require('../services/userService');

async function getGreeting(username) {
    const user = await userService.getUserByUsername(username);
    return user ? `Hello, ${user.username}!` : 'Hello, World!';
}

module.exports = getGreeting;
