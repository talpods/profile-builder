const userRepository = require('../infrastructure/userRepository');
const User = require('../entities/user');

class UserService {
    async getUserByUsername(username) {
        return await userRepository.getUserByUsername(username);
    }

    async saveUser(userData) {
        const user = new User(userData.username, userData.name, userData.email);
        await userRepository.saveUser(user);
    }

}

module.exports = new UserService();
