# Authorization Lambda Function

This Lambda function is responsible for handling user authentication, including login, logout, token refresh, and user validation using JWT tokens. The function is built following clean architecture principles.

## Routes

- **POST `/api/login`**: Authenticates a user and returns a JWT token.
- **PUT `/api/logout`**: Logs out a user by invalidating their token.
- **PUT `/api/refresh-token`**: Refreshes an expired JWT token.
- **GET `/api/validate`**: Validates the JWT token.
- **GET `/api/me`**: Retrieves the authenticated user's details.

## Prerequisites

- Node.js installed on your machine.
- npm or yarn installed.
- Docker installed if running with Docker.
- Serverless Framework installed if deploying with Serverless.

## Environment Variables

Make sure to set up a `.env` file in the root directory of this Lambda function. The following environment variables should be configured:

```env
PORT=4000
```

## Running the Lambda Function Locally

### 1. Install Dependencies

Navigate to the directory containing the `index.js` file and install the required dependencies:

```bash
npm install
```

### 2. Start the Express Server Locally

Uncomment the following lines in `index.js` to run the Express server locally:

```javascript
// const PORT = config.port || 4000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// module.exports = app;
```

Then, start the server:

```bash
npm start
```

The server will start on `http://localhost:4000`.

### 3. Testing the Routes

You can now test the routes using a tool like Postman or cURL. For example:

- **Login**: `POST http://localhost:4000/api/login`
- **Logout**: `PUT http://localhost:4000/api/logout`
- **Refresh Token**: `PUT http://localhost:4000/api/refresh-token`
- **Validate Token**: `GET http://localhost:4000/api/validate`
- **Get User Info**: `GET http://localhost:4000/api/me`

Make sure to include a valid JWT token in the `Authorization` header for all requests, except for the `/api/login` route.

## Running the Lambda Function with Docker

### 1. Build the Docker Image

Navigate to the directory containing the Dockerfile and build the Docker image:

```bash
docker build -t auth-lambda .
```

### 2. Run the Docker Container

Run the Docker container:

```bash
docker run -p 4000:4000 auth-lambda
```

The server will start on `http://localhost:4000`.

## Deploying the Lambda Function with Serverless Framework

### 1. Configure the Serverless Framework

Ensure that your `serverless.yml` file is correctly set up

### 2. Deploy the Lambda Function

Deploy the Lambda function to AWS using the Serverless Framework:

```bash
serverless deploy
```

This will deploy the function to AWS and set up the corresponding API Gateway routes.
