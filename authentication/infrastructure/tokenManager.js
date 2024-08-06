const dynamoDbClient = require('./dynamoDbClient');
const config = require('../config/config');
class TokenManager {
  async storeTokens(accessToken, refreshToken, accessTokenExpiration, refreshTokenExpiration) {
    const params = {
      TableName: config.dynamoDbTable,
      Item: {
        pk: config.TOKEN_PK,
        sk: `${config.TOKEN_SK}`+"#"+`${refreshToken}`,
        accessToken,
        accessTokenExpiration,
        invalidated: false,
        refreshToken,
        refreshTokenExpiration,
        refreshTokenInvalidated: false
      }
    };
    await dynamoDbClient.put(params).promise();
  }

  async updateTokens(newAccessToken, refreshToken, newAccessTokenExpiration) {
  const params = {
    TableName: config.dynamoDbTable,
    Key: {
      pk: config.TOKEN_PK,
      sk: `${config.TOKEN_SK}`+"#"+`${refreshToken}`
    },
    UpdateExpression: 'set accessToken = :newAccessToken, accessTokenExpiry = :newAccessTokenExpiry',
    ExpressionAttributeValues: {
      ':newAccessToken': newAccessToken,
      ':newAccessTokenExpiry': newAccessTokenExpiration
    }
  };

  try {
    await dynamoDbClient.update(params).promise();
  } catch (error) {
    console.error('Error updating tokens:', error);
    throw new Error('Error updating tokens');
  }
}

  async invalidateToken(refreshToken) {
    const params = {
      TableName: config.dynamoDbTable,
      Key: {
        pk: config.TOKEN_PK,
        sk: `${config.TOKEN_SK}`+"#"+`${refreshToken}`
      },
      UpdateExpression: 'set invalidated = :invalidated',
      ExpressionAttributeValues: {
        ':invalidated': true,
      }
    };
    await dynamoDbClient.update(params).promise();
  }

  async isTokenInvalidated(refreshToken) {
    const params = {
      TableName: config.dynamoDbTable,
      Key: {
        pk: config.TOKEN_PK,
        sk: `${config.TOKEN_SK}#${refreshToken}`
      }
    };
  
    try {
      const result = await dynamoDbClient.get(params).promise();
      if (!result.Item) {
        throw new Error('Token not found');
      }
      return result.Item.invalidated;
    } catch (error) {
      console.error('Error checking token invalidation:', error);
      throw new Error('Error checking token invalidation');
    }
  }
  

  async invalidateRefreshToken(refreshToken) {
    const params = {
      TableName: config.dynamoDbTable,
      Key: {
        pk: config.TOKEN_PK,
        sk: `${config.TOKEN_SK}`+"#"+`${refreshToken}`
      },
      UpdateExpression: 'set refreshTokenInvalidated = :refreshTokenInvalidated',
      ExpressionAttributeValues: {
        ':refreshTokenInvalidated': true
      }
    };
    await dynamoDbClient.update(params).promise();
  }

  async isRefreshTokenInvalidated(refreshToken) {
    const params = {
      TableName: config.dynamoDbTable,
      Key: {
        pk: config.TOKEN_PK,
        sk: `${config.TOKEN_SK}`+"#"+`${refreshToken}`
      }
    };
    const result = await dynamoDbClient.get(params).promise();
    return result.Item && result.Item.refreshTokenInvalidated;
  }

  async getTokenByRefreshToken(refreshToken) {
    const params = {
      TableName: config.dynamoDbTable,
      Key: {
        pk: config.TOKEN_PK,
        sk: `${config.TOKEN_SK}`+"#"+`${refreshToken}`
      }
    };
    const result = await dynamoDbClient.get(params).promise();
    return result.Item;
  }
}

module.exports = new TokenManager();
