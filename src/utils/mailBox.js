import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ORGANISATION,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpverifyEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Verify your email" <${process.env.EMAIL_ORGANISATION}>`,
    to: email,
    subject: "Email Verification OTP",
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
  });
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `http://localhost:9090/reset-password/${token}`;
  await transporter.sendMail({
    from: `"Verify your email" <${process.env.EMAIL_ORGANISATION}>`,
    to: email,
    subject: "Email Verification OTP",
    text: `Your OTP is ${token}. It will expire in 10 minutes. ${resetLink}`,
  });
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp: userOtp } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.otp || !user.otpExpiresAt) {
      return res
        .status(400)
        .json({ message: Message.otpNotFound });
    }

    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: Message.otpExpired });
    }

    if (user.otp !== userOtp) {
      return res.status(400).json({ message: Message.otpInvalid });
    }

    // OTP matched
    await prisma.user.update({
      where: { email },
      data: {
        verified: true,
        otp: null,
        otpExpiresAt: null,
      },
    });

    return res.status(200).json({ message: Message.emailVerified });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error during OTP verification.",
    });
  }
};
