const dynamoDbClient = require('./dynamoDbClient');
const config = require('../config/config');

class userRepository {
    async getUserByEmail(email) {
        const params = {
            TableName: config.dynamoDbTable,
            Key: {
                pk: config.USER_PK,
                sk: `${config.USER_SK}`+"#"+`${email}`
              }
        };
        try {
            const data = await dynamoDbClient.get(params).promise();
            return data.Item;
          } catch (error) {
            console.error('Error fetching user:', error);
            throw new Error('Error fetching user');
          }

    }

}

module.exports = new userRepository();
