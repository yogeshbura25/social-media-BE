import crypto from "crypto";

export const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const generateOtpExpiresAt = () => new Date(Date.now() + 10 * 60 * 1000); // 1 min from now

export const passwordToken = crypto.randomBytes(20).toString("hex");
export const tokenExpiration = new Date(Date.now() + 10 * 60 * 1000); // 1 minutes
