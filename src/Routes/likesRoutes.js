import express from "express";
import { likePost, unlikePost, getLikesCount } from "../Controllers/likesControllers.js";
import { verifyToken } from "../middleware/authentication.js";

const router = express.Router();

router.post("/like", verifyToken, likePost);
router.post("/unlike", verifyToken, unlikePost);
router.get("/likes/:postId", getLikesCount);

export default router;
