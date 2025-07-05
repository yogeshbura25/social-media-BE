import express from "express";
import { getComments} from "../Controllers/commentsControllers.js";
// import { verifyToken } from "../middleware/authentication.js";

const router = express.Router();
router.get("/:postId", 
    // verifyToken, 
    getComments);

export default router;
