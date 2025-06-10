import { Router } from "express";
import {
 createPost,getPost,deletePost,updatePost,sharePost
} from "../Controllers/postControllers.js";
import { verifyToken } from "../middleware/authentication.js";
 
import { uploadPost } from "../utils/multer-config.js"; 
const router = Router();

router.post("/createPost", verifyToken, uploadPost.array("post", 10), createPost);
router.get("/posts", verifyToken, getPost);
router.put("/post/:postId", verifyToken, uploadPost.array("post", 10), updatePost);
router.delete("/post/:postId", verifyToken, deletePost);
router.get("/sharePost/:id", verifyToken, sharePost);
export default router;
