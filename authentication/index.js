const express = require("express");
const helloRoutes = require("./routes/index");
const config = require("./config/config");
const serverless = require("serverless-http");
const swaggerSetup = require("./docs/swagger");
const cors = require("cors");
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

app.options("*", cors());

app.use(express.json());

app.use("/api", helloRoutes);

swaggerSetup(app);
const PORT = config.port || 4000;
// app.listen(PORT, () => {
// 	console.log(`Server is running on port ${PORT}`);
// });

// module.exports = app;

exports.handler = serverless(app);
