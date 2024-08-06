import { Router } from "express";
import profileController from "../controllers/profileController.js";

const router = Router();

router.get("/", profileController.getProfile);

router.put("/:slug", profileController.recreateProfile);

export default router;