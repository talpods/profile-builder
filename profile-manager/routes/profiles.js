import { Router } from "express";
import profileController from "../controllers/profileController.js";
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", profileController.getProfiles);

router.get("/:slug", profileController.getProfileData);

router.delete("/:slug", profileController.deleteProfile);

router.put(
  "/regenerateAndUpdateProfile/:slug",
  profileController.regenerateAndUpdateProfile
);
router.put("/updateData/:slug", profileController.updateProfileData);

router.post(
  "/newProfile",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "cv", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
    { name: "linkedInPage", maxCount: 1 },
  ]),
  profileController.createProfile
);

router.put(
  "/updatedProfile",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "cv", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
    { name: "linkedInPage", maxCount: 1 },
  ]),
  profileController.updateProfile
);

export default router;
