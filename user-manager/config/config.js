module.exports = {
    port: process.env.PORT || 3000,
    awsRegion: process.env.AWS_REGION,
    dynamoDbTable: process.env.DYNAMODB_TABLE,
    PK: process.env.PRIMARY_KEY,
    SK: process.env.SECONDARY_KEY
};