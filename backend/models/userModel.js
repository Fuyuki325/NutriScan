const dynamoDb = require('../config/db');

const tableName = 'hack-summer-credential';

const User = {
  getAll: async () => {
    const params = {
      TableName: tableName
    };
    const result = await dynamoDb.scan(params).promise();
    return result.Items;
  },
  getById: async (userId) => {
    const params = {
       TableName: tableName,
       Key: { id: userId }
     };
     try {
      const result = await dynamoDb.get(params).promise();
      return result.Item;
     } catch (error) {
      console.error('Error retrieving user by email:', error);
     }
   },
   getByEmail: async (email) => {
    const params = {
      TableName: tableName,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };
  
    try {
      const result = await dynamoDb.scan(params).promise();
      return result.Items[0];
    } catch (error) {
      console.error('Error retrieving user by email:', error);
    }
  },
   emailChecker: async (email) => {
      const params = {
        TableName: tableName,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email
        }
      };
    
      try {
        const result = await dynamoDb.scan(params).promise();
        if (result.Count <= 0) {
          return false;
        } else {
          return true;
        }
      } catch (error) {
        console.error('Error retrieving user by email:', error);
      }
   },
  saveSessionID: async (id, sessionID) => {
    const params = {
      TableName: tableName,
      Key: { id },
      UpdateExpression: 'set #sessionID = :sessionID',
      ExpressionAttributeNames: {
        '#sessionID': 'sessionID'
      },
      ExpressionAttributeValues: {
        ':sessionID': sessionID
      },
      ReturnValues: 'ALL_NEW'
    };
    const result = await dynamoDb.update(params).promise();
    return result.Attributes;
  },
  create: async (user) => {
     const params = {
       TableName: tableName,
       Item: user
     };
     await dynamoDb.put(params).promise();
     return user;
   },
   update: async (id, updates) => {
    const params = {
      TableName: tableName,
      Key: { id },
      UpdateExpression: 'set #name = :name, #email = :email, #password = :password, #vegan = :vegan, #vegetarian = :vegetarian, #halal = :halal, #glutenFree = :glutenFree, #dairyFree = :dairyFree, #nutFree = :nutFree',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#email': 'email',
        '#password': 'password',
        '#vegan': 'vegan',
        '#vegetarian': 'vegetarian',
        '#halal': 'halal',
        '#glutenFree': 'glutenFree',
        '#dairyFree': 'dairyFree',
        '#nutFree': 'nutFree'
      },
      ExpressionAttributeValues: {
        ':name': updates.name,
        ':email': updates.email,
        ':password': updates.password,
        ':vegan': updates.vegan,
        ':vegetarian': updates.vegetarian,
        ':halal': updates.halal,
        ':glutenFree': updates.glutenFree,
        ':dairyFree': updates.dairyFree,
        ':nutFree': updates.nutFree
      },
      ReturnValues: 'ALL_NEW'
    };
    
    const result = await dynamoDb.update(params).promise();
    return result.Attributes;
  },
  deleteUser: async (id) => {
    const params = {
      TableName: tableName,
      Key: { id }
    };
    const result = await dynamoDb.delete(params).promise();
    return result;
  },
  // other methods...
};

module.exports = User;