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
};

module.exports = User;