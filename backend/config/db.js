const AWS = require('aws-sdk');
require('dotenv').config();
AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});




console.log('init db', AWS.config.region)

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDb;