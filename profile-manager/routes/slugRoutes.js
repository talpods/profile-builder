import { Router } from "express";
import slugController from "../controllers/slugController.js";

const slugRouter = Router();

slugRouter.get('/:firstName/:lastName', slugController.getProfilesBySlug);

export default slugRouter;