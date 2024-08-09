# Authentication Lambda Function

This Lambda function handles authentication-related operations such as login, logout, token refresh, and user validation using JWT tokens.

## Routes

- **POST `/api/login`**: Authenticates a user and returns a JWT token.
- **PUT `/api/logout`**: Logs out a user by invalidating their token.
- **PUT `/api/refresh-token`**: Refreshes an expired JWT token.
- **GET `/api/validate`**: Validates the JWT token.
- **GET `/api/me`**: Retrieves the authenticated user's details.

## Prerequisites

- Node.js installed on your machine.
- npm or yarn installed.

## Environment Variables

Make sure to set up a `.env` file in the root directory of this Lambda function. The following environment variables should be configured:

```env
PORT=4000
```

## Running the Lambda Function Locally

To run this Lambda function locally, follow these steps:

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
//  console.log(`Server is running on port ${PORT}`);
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
- **Validate Token**: `GET http://localhost:4000/api/validate` (with Authorization header)

### 4. Deploying to AWS Lambda

When you're ready to deploy, make sure to comment out the local server lines and use the `serverless` export:

```javascript
exports.handler = serverless(app);
```

Then deploy the function using your preferred deployment method (e.g., AWS SAM, Serverless Framework).
