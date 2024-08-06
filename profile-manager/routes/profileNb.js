import { Router } from "express";
import profileNbController from "../controllers/profileNbController.js";

const profileNbRouter = Router();

profileNbRouter.get('/', profileNbController.getProfileNumber);

export default profileNbRouter;