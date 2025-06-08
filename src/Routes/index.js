
//All routes are imported here
import { Router } from "express";

import UserRoutes from "./userRoutes.js";

import BioRoutes from "./bioRoutes.js";

import userPost from "./postRoutes.js";
import postLikes from "./likesRoutes.js"
const router = Router();

router.use("/", UserRoutes);
router.use("/api", BioRoutes)
router.use("/api", userPost);
router.use("/api", postLikes);

export default router;
