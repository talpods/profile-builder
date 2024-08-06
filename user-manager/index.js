const express = require("express");
const helloRoutes = require("./routes/index");
const config = require("./config/config");
const serverless = require("serverless-http");
const cors = require("cors");
// const swaggerSetup = require('./docs/swagger');
require("dotenv").config();

const app = express();
// Use the cors middleware to allow everything
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: "GET,POST,PUT,DELETE,OPTIONS", // Allow all methods
    allowedHeaders: "Content-Type,Authorization,refreshToken", // Allow specific headers
  })
);
// Handle preflight requests for all routes
app.options("*", cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api", helloRoutes);

const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// module.exports = app;

exports.handler = serverless(app);
