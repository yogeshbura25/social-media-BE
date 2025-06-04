import { Router } from "express";
import {
  register,
  login,
  verifyEmail,
  resendOtp,
  deleteAcc,
  updatePassword,
  forgotPassword,
  resetPassword,

} from "../Controllers/userAuthentication.js";
import { verifyToken } from "../middleware/authentication.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOtp);
router.delete("/delete", verifyToken, deleteAcc);
router.patch("/update-password", verifyToken, updatePassword);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

export default router;
