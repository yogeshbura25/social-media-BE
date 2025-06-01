
//All routes are imported here
import { Router } from "express";

import UserRoutes from "./userRoutes.js";

import BioRoutes from "./bioRoutes.js"
const router = Router();

router.use("/", UserRoutes);
router.use("/api", BioRoutes)


export default router;
