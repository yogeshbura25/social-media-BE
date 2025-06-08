import { Router } from "express";
import {
  createUserBio,
  getUserBio,
  updateUserBio,
  deleteUserBio,
  getCompleteUserProfile
} from "../Controllers/bioControllers.js";
import { verifyToken } from "../middleware/authentication.js";
import { upload } from "../utils/multer-config.js"; 

const router = Router();

router.post("/createUserBio", verifyToken, upload.single('profilePhoto'), createUserBio);
router.get("/getUserBio", verifyToken, getUserBio);
router.patch("/updateUserBio", verifyToken, upload.single('profilePhoto'), updateUserBio);
router.delete("/deleteUserBio", verifyToken, deleteUserBio);
router.get("/getCompleteUserProfile/:slug", verifyToken, getCompleteUserProfile);
export default router;
