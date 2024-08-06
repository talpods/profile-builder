const dynamoDbClient = require('./dynamoDbClient');
const config = require('../config/config');
const bcrypt = require('bcrypt');

class userManagmentRepo {
  async getAllUsers() {
    const params = {
      TableName: config.dynamoDbTable,
      KeyConditionExpression: "#pk = :pkVal",
      ExpressionAttributeNames: {
        "#pk": "pk",
      },
      ExpressionAttributeValues: {
        ":pkVal": config.PK,
      },
    };

    const result = await dynamoDbClient.query(params).promise();
    const allUsers = result.Items;

    if (!allUsers) {
      return null;
    } else {
      const usersList = allUsers.map(user => ({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.acl.roles,
        createdAt: user.createdAt
      }));
      return usersList;
    }
  }
  async getUserByEmail(email) {
    const params = {
      TableName: config.dynamoDbTable,
      KeyConditionExpression: "#pk = :pkVal AND #sk = :skVal",
      ExpressionAttributeNames: {
        "#pk": "pk",
        "#sk": "sk",
      },
      ExpressionAttributeValues: {
        ":pkVal": config.PK,
        ":skVal": `${config.SK}`+"#"+`${email}`,
      },
    };
    const result = await dynamoDbClient.query(params).promise();
    return result.Items.length > 0 ? result.Items[0] : null;
  }
  async createUser(email, password, firstName, lastName, roles, createdAt) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const params = {
      TableName: config.dynamoDbTable,
      Item: {
        pk: config.PK,
        sk: `${config.SK}`+"#"+`${email}`,
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        createdAt: createdAt,
        acl: {
          resources: {
            profiles: {
              admin: ["read", "write", "delete"],
              buisnessReviewer: ["read", "write"],
              recruiter: ["read", "write"],
              techReviewer: ["read", "write"],
            },
            users: {
              admin: ["read", "write", "delete"],
              buisnessReviewer: [],
              recruiter: [],
              techReviewer: [],
            },
          },
          roles: roles,
        },
      }
    };


    try {
      
      await dynamoDbClient.put(params).promise();
      return { success: true, message: 'User created successfully' };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, message: 'Error creating user', error: error };
    }
  }

  async deleteUser(email) {
    const params = {
      TableName: config.dynamoDbTable,
      Key: {
        pk: config.PK,
        sk: `${config.SK}`+"#"+`${email}`,
      },
    };
  
    try {
      const result = await dynamoDbClient.delete(params).promise();
      if (!result.Attributes) {
        return true; // Deleted successfully
      } else {
        return false; // No item found to delete
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error; // Throw the error to handle it in the caller function
    }
  }

  async updateUser(email, firstName, lastName, roles) {
    const params = {
      TableName: config.dynamoDbTable,
      Key: {
        pk: config.PK,
        sk: `${config.SK}#${email}`,
      },
      UpdateExpression: "set #firstName = :firstName, #lastName = :lastName, #acl = :acl",
      ExpressionAttributeNames: {
        "#firstName": "firstName",
        "#lastName": "lastName",
        "#acl": "acl",
      },
      ExpressionAttributeValues: {
        ":firstName": firstName,
        ":lastName": lastName,
        ":acl": {
          resources: {
            profiles: {
              admin: ["read", "write", "delete"],
              buisnessReviewer: ["read", "write"],
              recruiter: ["read", "write"],
              techReviewer: ["read", "write"],
            },
            users: {
              admin: ["read", "write", "delete"],
              buisnessReviewer: [],
              recruiter: [],
              techReviewer: [],
            },
          },
          roles: roles,
        },
      },
      ReturnValues: "UPDATED_NEW",
    };

    try {
      const result = await dynamoDbClient.update(params).promise();
      return { success: true, message: 'User updated successfully', data: result.Attributes };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, message: 'Error updating user', error: error };
    }
  }

  async updatePassword(email, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const params = {
      TableName: config.dynamoDbTable,
      Key: {
        pk: config.PK,
        sk: `${config.SK}#${email}`,
      },

      UpdateExpression: 'SET #password = :newPassword',
      ExpressionAttributeNames: {
        '#password': 'password',
      },
      ExpressionAttributeValues: {
        ':newPassword': hashedPassword,
      },
      ReturnValues: 'ALL_NEW', // Optional, returns the updated item
    };

    try {
      const result = await dynamoDbClient.update(params).promise();
      return { success: true, updatedUser: result.Attributes };
    } catch (error) {
      console.error('Error updating password:', error);
      return { success: false, error: error };
    }
  
}

}

module.exports = new userManagmentRepo();