const dynamoDbClient = require('./dynamoDbClient');
const config = require('../config/config');

class userRepository {
    async getUserByUsername(username) {
        const params = {
            TableName: config.dynamoDbTable,
            Key: {
                PK: 'users',
                SK: `users#${username}`
              }
        };
        const result = await dynamoDbClient.get(params).promise();
        return result.Item;
    }

}

module.exports = new userRepository();
