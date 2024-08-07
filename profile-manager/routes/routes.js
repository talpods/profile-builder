// routes/routes.js

import express from "express";
import profilesRouter from "./profiles.js";
import profileRouter from "./profile.js";
import fileRouter from "./fileRouter.js";
import slugRoutes from "./slugRoutes.js";
import profileNbRouter from "./profileNb.js";

const router = express.Router();

// Combine all routes
router.use("/v1/profiles", profilesRouter);
router.use("/v1/profile", profileRouter);
router.use("/v1/files", fileRouter);
router.use("/profiles", slugRoutes);
router.use("/profileNb", profileNbRouter);

export default router;
