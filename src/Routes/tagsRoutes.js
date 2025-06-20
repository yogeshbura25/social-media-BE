
import express from "express";
import { createTag, getPostsByTag, updateTag } from "../Controllers/tagsControllers.js";
import { verifyToken } from "../middleware/authentication.js";

const router = express.Router();

router.post('/tags', verifyToken, createTag);
// router.get('/tags', verifyToken, getPostsByTag);
router.put('/tags/:id', verifyToken, updateTag);


export default router;