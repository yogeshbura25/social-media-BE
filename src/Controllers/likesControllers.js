import prisma from "../utils/db-config.js";

export const likePost = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.body;
  try {
    const existingLike = await prisma.Likes.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      return res.status(400).json({ message: "Already liked this post." });
    }

    await prisma.Likes.create({
      data: { userId, postId },
    });

    res.status(201).json({ message: "Post liked." });
  } catch (error) {
    res.status(500).json({ message: "Error liking post", error });
  }
};

export const unlikePost = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.body;

  try {
    await prisma.Likes.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });

    res.status(200).json({ message: "Post unliked." });
  } catch (error) {
    res.status(500).json({ message: "Error unliking post", error });
  }
};

// Get total likes for a post
export const getLikesCount = async (req, res) => {
  const { postId } = req.params;

  try {
    const count = await prisma.Likes.count({
      where: { postId: parseInt(postId) },
    });

    res.status(200).json({ postId: parseInt(postId), likes: count });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch like count", error });
  }
};
