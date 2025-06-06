import prisma from "../utils/db-config.js";
import fs from "fs";
import path from "path";

export const createPost = async (req, res) => {
  const { description } = req.body;
  const userId = req.user.id;
  const file = req.file;
  const baseUrl = `${process.env.baseUrl}`;
  const post = file?.filename;
  const postPath = file ? `${baseUrl}/uploads/post/${file.filename}` : null;

  try {
    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    const Post = await prisma.user_Post.create({
      data: {
        post,
        postPath,
        description,
        userId,
      },
    });
    return res.status(201).json({
      message: "Post created successfully",
      data: Post,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const getPost = async (req, res) => {
  const userId = req.user.id;

  try {
    const userPosts = await prisma.user_Post.findMany({
      where: {
        userId,
      },
        orderBy: { createdAt: "desc" },
    });
    const baseUrl = `${process.env.baseUrl}`;

    const postsWithFullPath = userPosts.map(post => ({
      ...post,
      postPath: `${baseUrl}/uploads/post/${post.post}`, 
    }));
    return res.status(201).json({
      message: "User posts fetched successfully.",
      data: postsWithFullPath,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const deletePost = async (req, res) => {
  const userId = req.user.id;
  const postId = parseInt(req.params.id); // post ID from URL

  try {
    const post = await prisma.user_Post.findUnique({
      where: { id: postId },
    });

    // Validate ownership
    if (!post || post.userId !== userId) {
      return res.status(404).json({ message: "Post not found or unauthorized." });
    }

    // Delete file if it exists
    const filePath = path.join("uploads", "post", post.post);
    if (post.post && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from DB
    await prisma.user_Post.delete({ where: { id: postId } });

    return res.status(200).json({ message: "Post deleted successfully.", postId });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ message: "Failed to delete post." });
  }
};