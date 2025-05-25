import prisma from "../utils/db-config.js";
import bcrypt from "bcrypt";
import { Message } from "../utils/Message.js";

export const registerUser = async (req, res) => {
  const { email, password, confirmpassword } = req.body;
  const finduser = await prisma.User.findUnique({
    where: {
      email,
    },
  });
  if (finduser) {
    return res.status(400).json({
      message: Message.emailExists,
    });
  }

  if (password !== confirmpassword) {
    return res.status(400).json({
      message: Message.passwordMismatch,
    });
  }
  const saltPassword = 10;
  const hashedPassword = await bcrypt.hash(password, saltPassword);
  const createnewuser = await prisma.User.create({
    data: {
      email,
      password: hashedPassword, 
    },
  });
  return res.status(200).json({
    data: createnewuser, 
    message: Message.registrationSuccess,
  });
};
