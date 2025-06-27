import { Router } from "express";
import {
 createStories, 
//  getStories
} from "../Controllers/storiesControllers.js";
import { verifyToken } from "../middleware/authentication.js";
 
const router = Router();

router.post("/createstory", verifyToken, createStories);
// router.get("/getStory", verifyToken, getStories);

export default router;
