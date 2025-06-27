import { Router } from "express";
import {
 createStories, 
//  getStories
} from "../Controllers/storiesControllers.js";
import { uploadStory } from "../utils/multer-config.js";
import { verifyToken } from "../middleware/authentication.js";
 
const router = Router();

router.post("/createstory", verifyToken, uploadStory.single('image'),createStories);
// router.get("/getStory", verifyToken, getStories);

export default router;
