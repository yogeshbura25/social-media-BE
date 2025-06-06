import { Router } from "express";
import {
 createPost,getPost,deletePost
} from "../Controllers/userPost.js";
import { verifyToken } from "../middleware/authentication.js";
 
import { uploadPost } from "../utils/multer-config.js"; 
const router = Router();

router.post("/createPost", verifyToken, uploadPost.single("post"),createPost);
router.get("/getPost", verifyToken, getPost);
router.delete("/post/:id", verifyToken, deletePost)


export default router;
