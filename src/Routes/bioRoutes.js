import { Router } from "express";
import {

  createUserBio, getUserBio, updateUserBio, deleteUserBio
} from "../Controllers/bioDetails.js";
import { verifyToken } from "../middleware/authentication.js";

const router = Router();


router.post("/createUserBio", verifyToken, createUserBio);
router.get("/getUserBio", verifyToken,  getUserBio);
router.patch("/updateUserBio", verifyToken, updateUserBio);
router.delete("/deleteUserBio", verifyToken, deleteUserBio)
export default router;
