import prisma from "../utils/db-config.js";
import { Message } from "../utils/Message.js";
import fs from "fs";
import path from "path";

export const createUserBio = async (req, res) => {
  const { username, bio, gender, DOB, country } = req.body;
  const userId = req.user.id;
  const file = req.file;

  const baseUrl = `${process.env.baseUrl}`;
  const profilePhoto = file?.filename;
  const photoPath = file ? `${baseUrl}/uploads/${file.filename}` : null;
  // photoPath: file ? `https://s3.amazonaws.com/yourbucket/${file.filename}` : null, Production
  if (!username) {
    if (file) fs.unlinkSync(file.path);
    return res.status(400).json({ message: Message.USERNAME });
  }

  try {
    const bioExists = await prisma.user_Bio.findUnique({
      where: { userId },
    });

    if (bioExists) {
      if (file) fs.unlinkSync(file.path);
      return res.status(409).json({ message: Message.BIO_EXISTED });
    }

    const newUserBio = await prisma.user_Bio.create({
      data: {
        username,
        profilePhoto,
        photoPath,
        bio,
        gender,
        DOB: DOB ? new Date(DOB) : null,
        country,
        userId,
      },
    });

    return res.status(201).json({
      message: Message.BIO_CREATED,
      data: newUserBio,
    });
  } catch (error) {
    if (file) fs.unlinkSync(file.path);

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
    const baseUrl = `${process.env.baseUrl}`;

    const fullPhotoUrl = UserBio.profilePhoto
      ? `${baseUrl}/uploads/${UserBio.profilePhoto}`
      : null;

    return res.status(201).json({
      message: "User bio fecthed successfully.",
      data: {
        ...UserBio,
        photoPath: fullPhotoUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: Message.ERROR });
  }
};

export const updateUserBio = async (req, res) => {
  const { username, bio, gender, DOB, country } = req.body;
  const userId = req.user.id;
  const file = req.file;

  const baseUrl = process.env.baseUrl;

  try {
    const bioExists = await prisma.user_Bio.findUnique({
      where: { userId },
    });

    if (!bioExists) {
      return res.status(404).json({ message: "User bio not found." });
    }

    let profilePhoto = bioExists.profilePhoto;
    let photoPath = bioExists.photoPath;

    //  Handle new file upload and delete old one
    if (file) {
      const oldFilePath = path.join("uploads", "photos", profilePhoto);

      try {
        if (profilePhoto && fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath); //  Remove old file from disk
          console.log("Old file deleted:", oldFilePath);
        }
      } catch (err) {
        console.error("Failed to delete old photo:", err.message);
      }

      profilePhoto = file.filename;
      photoPath = `${baseUrl}/uploads/photos/${file.filename}`;
    }

    //  Update database
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
        profilePhoto,
        photoPath,
      },
    });

    return res.status(201).json({
      message: "User bio updated successfully.",
      data: newUserBio,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Something went wrong." });
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

export const getCompleteUserProfile = async (req, res) => {
  const { slug } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: {
        bio: {
          username: slug,
        },
      },
      include: {
        bio: true,
        post: {
          orderBy: { createdAt: 'desc' },
          include: {
            files: true,
            likes: {
              include: {
                user: {
                  select: {
                    bio: {
                      select: { username: true },
                    },
                  },
                },
              },
            },
          },
        },
        likes: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const formattedPosts = user.post.map((post) => {
      const likedUsers = post.likes.map(
        (like) => like.user?.bio?.username || "Unknown"
      );

      return {
        ...post,
        files: post.files.map((file) => ({
          ...file,
          postPath: `${process.env.baseUrl}/uploads/post/${file.post}`,
        })),
        likeCount: likedUsers.length,
        likedUsers,
      };
    });

    res.status(200).json({
      message: "Full user profile fetched",
      profile: {
        id: user.id,
        email: user.email,
        bio: user.bio,
        posts: formattedPosts,
        likesGiven: user.likes,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
