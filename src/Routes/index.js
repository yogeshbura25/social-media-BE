
//All routes are imported here
import { Router } from "express";

import UserRoutes from "./userRoutes.js";

import BioRoutes from "./bioRoutes.js";

import userPost from "./postRoutes.js";
const router = Router();

router.use("/", UserRoutes);
router.use("/api", BioRoutes)
router.use("/api", userPost);
export default router;
