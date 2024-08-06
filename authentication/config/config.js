module.exports = {
    port: process.env.PORT || 4000,
    awsRegion: process.env.AWS_REGION,
    dynamoDbTable: process.env.DYNAMODB_TABLE,
    USER_PK: process.env.USER_KEY,
    USER_SK: process.env.USER_KEY,
    TOKEN_PK: process.env.TOKEN_KEY,
    TOKEN_SK: process.env.TOKEN_KEY
};