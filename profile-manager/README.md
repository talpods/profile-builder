# Profile Manager Lambda Function

This Lambda function is responsible for managing profiles, handling file uploads, and other profile-related operations. It interacts with AWS services like DynamoDB, S3, and SNS, and it provides multiple API endpoints to manage profiles.

## Routes

The function exposes the following API routes:

- **GET `/v1/profiles`**: Retrieve a list of profiles.
- **POST `/v1/profiles`**: Create a new profile.
- **PUT `/v1/profiles/:id`**: Update a profile by ID.
- **DELETE `/v1/profiles/:id`**: Delete a profile by ID.

- **GET `/v1/profile/:id`**: Retrieve a specific profile by ID.
- **POST `/v1/profile`**: Create a new profile (alternative route).

- **POST `/v1/files/upload`**: Upload a file related to a profile.

- **GET `/profiles/:firstName/:lastName`**: Retrieve profiles by slug (first name and last name).

- **POST `/profileNb/`**: Create or update a profile notebook (used for profile-related notes).

## Prerequisites

- Node.js installed on your machine.
- npm or yarn installed.
- Docker installed if running with Docker.
- Serverless Framework installed if deploying with Serverless.
- AWS account with configured credentials.

## Environment Variables

Make sure to set up a `.env` file in the root directory of this Lambda function. The following environment variables should be configured:

```env
AWS_ACCESS_KEY_ID1=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY1=your_aws_secret_access_key
AWS_REGION1=eu-north-1
DYNAMODB_TABLE=your_dynamodb_table_name
VERSION=your_api_version
PRIMARY_KEY=your_primary_key
AWS_PUBLIC_BUCKET=your_s3_public_bucket
AWS_PRIVATE_BUCKET=your_s3_private_bucket
SNS_TOPIC_ARN=your_sns_topic_arn
AWS_PUBLIC_BUCKET_LINK=your_s3_public_bucket_link
VALIDATE_LINK=your_validation_link
OPENAI_API_KEY=your_openai_api_key
```

## Running the Lambda Function Locally

### 1. Install Dependencies

Navigate to the directory containing the `index.js` file and install the required dependencies:

```bash
npm install
```

### 2. Start the Express Server Locally

To test the HTTP endpoints locally, start the server:

```bash
npm start
```

The server will start on `http://localhost:3000`.

### 3. Testing the Routes

You can now test the routes using a tool like Postman or cURL. For example:

- **Get Profiles**: `GET http://localhost:3000/v1/profiles`
- **Create Profile**: `POST http://localhost:3000/v1/profiles`
- **Upload File**: `POST http://localhost:3000/v1/files/upload`
- **Get Profile by Slug**: `GET http://localhost:3000/profiles/:firstName/:lastName`

Make sure to send the necessary payloads in the request body and include any required headers.

## Running the Lambda Function with Docker

### 1. Build the Docker Image

Navigate to the directory containing the Dockerfile and build the Docker image:

```bash
docker build -t profile-manager .
```

### 2. Run the Docker Container

Run the Docker container:

```bash
docker run -p 3000:3000 profile-manager
```

The server will start on `http://localhost:3000`.

## Deploying the Lambda Function with Serverless Framework

### 1. Configure the Serverless Framework

Ensure that your `serverless.yml` file is correctly set up

### 2. Deploy the Lambda Function

Deploy the Lambda function to AWS using the Serverless Framework:

```bash
serverless deploy
```

This will deploy the function to AWS and set up the corresponding API Gateway routes, DynamoDB tables, S3 buckets, and SNS topics as specified.
