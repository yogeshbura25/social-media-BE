import prisma from "../utils/db-config.js";
import { Message } from "../utils/Message.js";

export const createUserBio = async (req, res) => {
  const { username, bio, gender, DOB, country } = req.body;
  const userId = req.user.id;

  if (!username) {
    return res.status(400).json({ message: Message.USERNAME });
  }

  try {
    // Check if user bio already exists for this user
    const bioExists = await prisma.user_Bio.findUnique({
      where: { userId },
    });

    if (bioExists) {
      return res.status(409).json({ message: Message.BIO_EXISTED });
    }

    const newUserBio = await prisma.user_Bio.create({
      data: {
        username,
        bio,
        gender,
        DOB,
        country,
        userId,
      },
    });

    return res.status(201).json({
      message: Message.BIO_CREATED,
      data: newUserBio,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Username already taken." });
    }
    return res.status(500).json({ message: Message.ERROR });
  }
};

export const getUserBio = async (req, res) => {
  const userId = req.user.id;

  try {

    const UserBio = await prisma.user_Bio.findUnique({
      where: {
        userId,
      },
    });

    return res.status(201).json({
      message: "User bio fecthed successfully.",
      data: UserBio,
    });
  } catch (error) {
    return res.status(500).json({ message: Message.ERROR });
  }
};

export const updateUserBio = async (req, res) => {
  const { username, bio, gender, DOB, country } = req.body;
  const userId = req.user.id;

  try {
    // Check if user bio already exists for this user
    const bioExists = await prisma.user_Bio.findUnique({
      where: { userId },
    });

    if (!bioExists) {
      return res.status(404).json({ message: "User bio not found." });
    }

    const newUserBio = await prisma.user_Bio.update({
      where: {
        userId,
      },
      data: {
        username,
        bio,
        gender,
        DOB,
        country,
        userId,
      },
    });

    return res.status(201).json({
      message: "User bio updated successfully.",
      data: newUserBio,
    });
  } catch (error) {
    return res.status(500).json({ message: Message.ERROR });
  }
};

export const deleteUserBio = async (req, res) => {
  const userId = req.user.id;

  try {
    // Check if user bio already exists for this user
    const bioExists = await prisma.user_Bio.findUnique({
      where: { userId },
    });

    if (!bioExists) {
      return res.status(404).json({ message: "User bio not found." });
    }

    const UserBio = await prisma.user_Bio.delete({
      where: {
        userId,
      },
    });

    return res.status(201).json({
      message: "User bio deleted successfully.",
      data: UserBio,
    });
  } catch (error) {
    return res.status(500).json({ message: Message.ERROR });
  }
};
