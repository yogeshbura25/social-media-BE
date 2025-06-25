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

} from "../Controllers/userControllers.js";
import { verifyToken } from "../middleware/authentication.js";
import { limiter } from "../utils/rateLimiter.js";

const router = Router();

router.post("/register", register, limiter);
router.post("/login", login, limiter);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOtp, limiter);
router.delete("/delete", verifyToken, deleteAcc);
router.patch("/update-password", verifyToken, updatePassword);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

export default router;
