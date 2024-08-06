import express from "express";
import cors from "cors"; // Import CORS package
import { config } from "./config/config.js";
import profilesRouter from "./routes/profiles.js";
import profileRouter from "./routes/profile.js";
import fileRouter from "./routes/fileRouter.js";
import slugRoutes from "./routes/slugRoutes.js";
import profileNbRouter from "./routes/profileNb.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow all HTTP methods
    allowedHeaders: ["Content-Type", "Authorization, refreshToken"], // Allow headers for authentication and content-type
  })
);

const version = config.version;

// Routes
app.use(`/v1/profiles`, profilesRouter);
app.use(`/v1/profile`, profileRouter);
app.use(`/v1/files`, fileRouter);
app.use(`/profiles`, slugRoutes);
app.use(`/profileNb`, profileNbRouter);

// Start the server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

export default app;
