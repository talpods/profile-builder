# Profile Worker Lambda Function

This Lambda function is responsible for generating user profiles using ChatGPT and placing the generated profiles into an AWS SQS queue. The function is triggered by SQS events, which contain messages sent via AWS SNS.

## Prerequisites

- Node.js installed on your machine.
- npm or yarn installed.
- Docker installed if running with Docker.
- Serverless Framework installed if deploying with Serverless.
- AWS account with configured credentials.

## Environment Variables

Make sure to set up a `.env` file in the root directory of this Lambda function. The following environment variables should be configured:

```env
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=eu-north-1
PORT=3000
DYNAMODB_TABLE=your_dynamodb_table_name
```

## Running the Lambda Function Locally

Since this Lambda function is designed to be triggered by AWS SQS events, you'll need to simulate such an event to run it locally. There are several ways to do this:

### Using Serverless Framework's `invoke local` Command

You can use the Serverless Framework to invoke the function locally with a test event:

```bash
serverless invoke local --function generateProfile --path event.json
```

Create an `event.json` file in the root directory to simulate the SQS event:

```json
{
  "Records": [
    {
      "body": "{\"Message\": \"{\\\"slug\\\": \\\"example-slug\\\"}\"}"
    }
  ]
}
```

This command will simulate an SQS event and invoke your Lambda function locally.

This assumes you have a SAM template configured to map the Lambda function.

## Running the Lambda Function with Docker

### 1. Build the Docker Image

Navigate to the directory containing the Dockerfile and build the Docker image:

```bash
docker build -t profile-worker .
```

### 2. Run the Docker Container

Run the Docker container:

```bash
docker run -p 3000:3000 profile-worker
```

**Note:** Running this command will start the container, but since the function is a handler, you'll need to trigger it with an event as shown in the previous section.

## Deploying the Lambda Function with Serverless Framework

### 1. Configure the Serverless Framework

Ensure that your `serverless.yml` file is correctly set up

### 2. Deploy the Lambda Function

Deploy the Lambda function to AWS using the Serverless Framework:

```bash
serverless deploy
```

This will deploy the function to AWS and set up the corresponding SQS and SNS configurations.

## Processing Messages

The Lambda function is triggered by messages in an SQS queue. It processes each message by generating a profile using ChatGPT and then logs the result.

### Error Handling

If an error occurs while processing an SQS message, it is logged and the function returns a `500` status code.
