
import { Router } from "express";
import { registerUser } from "../Controllers/userAuthentication.js";

const router = Router();

router.post("/register-user", registerUser); 


export default router;
