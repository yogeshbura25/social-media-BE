import prisma from "../utils/db-config.js";
import bcrypt from "bcrypt";
import { Message } from "../utils/Message.js";
import jwt from "jsonwebtoken";
import {
  sendOtpverifyEmail,
  sendPasswordResetEmail,
} from "../utils/mailBox.js";
import { generateOtp, generateOtpExpiresAt, passwordToken, tokenExpiration } from "../utils/otp.js";
import cron from 'node-cron';


cron.schedule('*/10 * * * *', async () => {
    // console.log("Running OTP cleanup at", new Date().toISOString());
  try {
    const result = await prisma.user.updateMany({
      where: {
        OR: [
          {
            otpExpiresAt: {
              lt: new Date(),
            },
          },
          {
            resetPasswordExpires: {
              lt: new Date(),
            },
          },
        ],
      },
      data: {
        otp: null,
        otpExpiresAt: null,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    // console.log(`Expired OTPs and tokens cleared: ${result.count}`);
  } catch (error) {
    // console.error('Error clearing expired OTPs:', error);
       res.status(500).json({ message: error });
  }
});


export const register = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
 
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: Message.EMAIL_ALREADY_EXISTS,
      });
    }

  
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: Message.PASSWORD_ERROR,
      });
    }

  
    const saltRounds = 6;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

 
    const otp = generateOtp();
    const otpExpiresAt = generateOtpExpiresAt();

  
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        otp,
        otpExpiresAt,
        verified: false,
      },
    });

  
    res.status(200).json({
      data: newUser,
      message: Message.REGISTER_SUCCESS,
    });

  
    sendOtpverifyEmail(email, otp).catch((err) => {
      console.error("Email sending failed:", err.message);
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: Message.REGISTER_ERROR,
    });
  }
};


export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!otp) {
      return res.status(401).json({
        message: Message.OTP_REQUIRED,
      });
    }
    // if (!findUser || !findUser.otp || !findUser.otpExpiresAt) {
    //   return res.status(400).json({
    //     message: Message.OTP_REQUIRED,
    //   });
    // }
    if (new Date() > findUser.otpExpiresAt) {
      return res.status(401).json({
        message: Message.OTP_EXPIRED,
      });
    }
    if (findUser.otp !== otp) {
      return res.status(401).json({ message: Message.INVALID_OTP });
    }

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        verified: true,
        otp: null,
        otpExpiresAt: null,
      },
    });
    return res.status(200).json({
      message: Message.EMAIL_VERIFIED_SUCCESS,
    });
  } catch (error) {
    return res.status(500).json({
      message: Message.OTP_VERIFICATION_FAILED,
    });
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const findUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!findUser) {
      return res.status(404).json({ message: Message.USER_NOT_FOUND });
    }

    if (findUser.verified) {
      return res.status(400).json({ message: "User is already verified." });
    }

    const otp = generateOtp();
    const otpExpiresAt = generateOtpExpiresAt();

    await prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpiresAt,
        verified: false,
      },
    });

    await sendOtpverifyEmail(email, otp);

    return res.status(200).json({ message: "OTP resent successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to resend OTP." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!findUser) {
      return res.status(404).json({
        message: Message.INVALID_CREDENTIALS,
      });
    }

    if (!findUser.verified) {
      return res.status(404).json({
        message: Message.NOT_VERIFIED,
      });
    }
    const ispasswordValid = await bcrypt.compare(password, findUser.password);

    if (!ispasswordValid) {
      return res.status(404).json({
        message: Message.INVALID_CREDENTIALS,
      });
    }

    const token = jwt.sign(
      {
        userId: findUser.id,
        userEmail: findUser.email,
      },
      process.env.JWT_SECRET,
      // { expiresIn: "9h" }
    );

    return res.status(200).json({
      token,
      message: Message.LOGIN_SUCCESS,
    });
  } catch (error) {
    //  console.error(error.message);
    return res.status(500).json({
      message: Message.LOGIN_ERROR,
    });
  }
};

export const updatePassword = async (req, res) => {
  const email = req.user.email;
  const { currentPassword, newPassword, confirmPassword } = req.body;
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!findUser) {
      return res.status(404).json({
        message: Message.EMAIL_ALREADY_EXISTS,
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, findUser.password);

    if (!isMatch) {
      return res.status(404).json({
        message: Message.OLD_PASSWORD_INCORRECT,
      });
    }

    if (currentPassword === newPassword) {
      return res.status(404).json({
        message: Message.PASSWORD_SAME_AS_OLD,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(404).json({
        message: Message.PASSWORD_MISMATCH,
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return res.status(200).json({ message: Message.PASSWORD_UPDATED_SUCCESS });
  } catch (error) {
    res.status(500).json({ message: Message.UPDATE_PASSWORD_ERROR });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const findUser = await prisma.user.findUnique({ where: { email } });

    if (!findUser) {
      return res.status(400).json({ message: Message.USER_NOT_FOUND });
    }

    // Generate token and expiration
    const token = passwordToken; // or generateResetToken()
    const tokenPasswordExpiration = tokenExpiration; // or your expiration logic

    // Save token to DB
    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: tokenPasswordExpiration,
      },
    });

    // ✅ Respond immediately
    res.status(200).json({
      message: Message.PASSWORD_RESET_LINK_SENT,
    });

    // ✅ Send email **after response**, don't block user
    sendPasswordResetEmail(email, token).catch((err) => {
      console.error("Failed to send reset email:", err.message);
    });

  } catch (error) {
    console.error("Forgot password error", error);
    res.status(500).json({ message: Message.FORGOT_PASSWORD_ERROR });
  }
};


export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Password validation
    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    // Find user with valid reset token and non-expired token
    const findUser = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(), // token not expired
        },
      },
    });

    if (!findUser) {
      return res
        .status(400)
        .json({ message: Message.INVALID_OR_EXPIRED_TOKEN });
    }

    // Check if password is same as old one
    const isSamePassword = await bcrypt.compare(password, findUser.password);
    if (isSamePassword) {
      return res
        .status(400)
        .json({ message: Message.PASSWORD_SAME_AS_OLD });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 6); // 🔒 better security

    // Update user with new password and clear reset token
    await prisma.user.update({
      where: { id: findUser.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return res.status(200).json({ message: Message.PASSWORD_RESET_SUCCESS });

  } catch (error) {
    console.error("Reset password error", error);
    return res
      .status(500)
      .json({ message: Message.RESET_PASSWORD_ERROR });
  }
};


export const deleteAcc = async (req, res) => {
  const email = req.user.email; // email from token
  try {
    const findUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!findUser) {
      return res.status(404).json({
        message: Message.USER_NOT_FOUND,
      });
    }

    const deletedUser = await prisma.user.delete({
      where: { email },
    });

    return res.status(200).json({
      data: deletedUser,
      message: Message.DELETED,
    });
  } catch (error) {
    return res.status(500).json({
      message: Message.FAILED_DELETED,
    });
  }
};


