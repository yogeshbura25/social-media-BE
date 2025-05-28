export const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const generateOtpExpiresAt = () => new Date(Date.now() + 1 * 60 * 1000); // 1 min from now
