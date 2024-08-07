import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import router from "./routes/routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization, refreshToken"],
  })
);

const version = config.version;

// Use the consolidated routes
app.use("/", router);

export default app;
