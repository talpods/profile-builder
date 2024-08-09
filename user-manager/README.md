# User Manager Lambda Function

This Lambda function is responsible for managing users, including creating, retrieving, updating, and deleting user information. It also handles user password updates. The function is built following clean architecture principles.

## Routes

- **POST `/api/users`**: Creates a new user. Requires a valid token.
- **GET `/api/users`**: Retrieves all users. Requires a valid token.
- **GET `/api/users/:email`**: Retrieves a user by email. Requires a valid token.
- **DELETE `/api/users`**: Deletes a user. Requires a valid token.
- **PUT `/api/users`**: Updates user information. Requires a valid token.
- **POST `/api/users/update-password`**: Updates a user's password. Requires a valid token.

## Prerequisites

- Node.js installed on your machine.
- npm or yarn installed.
- Docker installed if running with Docker.
- Serverless Framework installed if deploying with Serverless.

## Environment Variables

Make sure to set up a `.env` file in the root directory of this Lambda function. The following environment variables should be configured:

```env
PORT=8080
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
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// module.exports = app;
```

Then, start the server:

```bash
node index.js
```

The server will start on `http://localhost:8080`.

### 3. Testing the Routes

You can now test the routes using a tool like Postman or cURL. For example:

- **Create User**: `POST http://localhost:8080/api/users`
- **Get All Users**: `GET http://localhost:8080/api/users`
- **Get User by Email**: `GET http://localhost:8080/api/users/:email`
- **Delete User**: `DELETE http://localhost:8080/api/users`
- **Update User**: `PUT http://localhost:8080/api/users`
- **Update Password**: `POST http://localhost:8080/api/users/update-password`

Make sure to include a valid JWT token in the `Authorization` header for all requests.

## Running the Lambda Function with Docker

### 1. Build the Docker Image

Navigate to the directory containing the Dockerfile and build the Docker image:

```bash
docker build -t user-manager-lambda .
```

### 2. Run the Docker Container

Run the Docker container:

```bash
docker run -p 4040:4040 user-manager-lambda
```

The server will start on `http://localhost:4040`.

## Deploying the Lambda Function with Serverless Framework

### 1. Configure the Serverless Framework

Ensure that your `serverless.yml` file is correctly set up

### 2. Deploy the Lambda Function

Deploy the Lambda function to AWS using the Serverless Framework:

```bash
serverless deploy
```

This will deploy the function to AWS and set up the corresponding API Gateway routes.
