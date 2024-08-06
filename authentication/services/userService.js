const userRepository = require('../infrastructure/userRepository');
// const User = require('../entities/user');

class UserService {
    async getUserByEmail(email) {
        
        return await userRepository.getUserByEmail(email);
    }


}

module.exports = new UserService();
