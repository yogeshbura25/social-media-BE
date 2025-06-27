
//All routes are imported here
import { Router } from "express";

import UserRoutes from "./userRoutes.js";

import BioRoutes from "./bioRoutes.js";

import userPost from "./postRoutes.js";
import postLikes from "./likesRoutes.js";
import postTags from "./tagsRoutes.js";
import stories from "./storiesRoutes.js";
const router = Router();

router.use("/", UserRoutes);
router.use("/api", BioRoutes)
router.use("/api", userPost);
router.use("/api", postLikes);
router.use("/api", postTags);
router.use("/api", stories);
export default router;
