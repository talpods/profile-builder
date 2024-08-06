import { Router } from "express";
import fileController from "../controllers/fileController.js";

const router = Router();

router.delete("/file", fileController.deleteFile);

export default router;