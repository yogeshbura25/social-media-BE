
//All routes are imported here
import { Router } from "express";

import UserRoutes from "./userRoutes.js";


const router = Router();

router.use("/", UserRoutes);



export default router;
