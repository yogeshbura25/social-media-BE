export const Message = {
  REGISTER_SUCCESS: "Registration successful.",
  EMAIL_ALREADY_EXISTS: "Email already exists.",
  REGISTER_ERROR: "Failed to register. Please try again.",
  PASSWORD_ERROR: "Password and confirm password do not match",

  OTP_SENT_SUCCESSFULLY: "OTP has been sent to your email.",

  OTP_ALREADY_SENT:
    "OTP was already sent. Please wait before requesting again.",
  OTP_VERIFIED_SUCCESSFULLY: "OTP verified successfully.",
  INVALID_OTP: "The OTP entered is invalid.",
  OTP_EXPIRED: "The OTP has expired. Please request a new one.",
  OTP_REQUIRED: "OTP is required to proceed.",
  OTP_VERIFICATION_FAILED: "OTP verification failed. Please try again.",

  LOGIN_SUCCESS: "Login successful.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  LOGIN_ERROR: "Failed to login. Please try again.",
  NOT_VERIFIED: "Email not verified, Please verify",

  EMAIL_VERIFICATION_SENT: "Verification email has been sent.",
  EMAIL_ALREADY_VERIFIED: "Email is already verified.",
  EMAIL_VERIFIED_SUCCESS: "Email verified successfully.",
  INVALID_OR_EXPIRED_VERIFICATION_LINK:
    "Verification link is invalid or has expired.",
  VERIFY_ERROR: "Failed to verify email.",

  USER_NOT_FOUND: "No account found with this email.",
  PASSWORD_RESET_LINK_SENT: "Password reset link has been sent to your email.",
  FORGOT_PASSWORD_ERROR: "Failed to process forgot password request.",
  CURRENT_PASSWORD: "Current password do not match.",

  INVALID_OR_EXPIRED_TOKEN: "Reset token is invalid or has expired.",
  PASSWORD_SAME_AS_OLD: "New password cannot be the same as the old password.",
  PASSWORD_RESET_SUCCESS: "Password has been reset successfully.",
  RESET_PASSWORD_ERROR: "Failed to reset password.",

  OLD_PASSWORD_INCORRECT: "Old password is incorrect.",
  PASSWORD_MISMATCH: "New password and confirm password do not match.",
  PASSWORD_UPDATED_SUCCESS: "Password updated successfully.",
  UPDATE_PASSWORD_ERROR: "Failed to update password.",
  DELETED: "Successfully deleted account.",
  FAILED_DELETED: "Failed to delete account.",
  DB_CONNECTED: "Connected to the database successfully!",
  DB_FAILED: "Failed to connect to the database",
};
