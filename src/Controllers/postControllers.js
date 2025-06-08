import prisma from "../utils/db-config.js";
import fs from "fs";
import path from "path";

export const createPost = async (req, res) => {
  const { description } = req.body;
  const userId = req.user.id;
  const files = req.files;
  const baseUrl = `${process.env.baseUrl}`;

  // Validate that at least description or files are provided
  if ((!files || files.length === 0) && !description?.trim()) {
    return res
      .status(400)
      .json({ message: "Post must contain a file or description." });
  }

  try {
    // 1. Create the post
    const createdPost = await prisma.user_Post.create({
      data: {
        description,
        userId,
      },
    });

    // 2. Store files (if any)
    let createdFiles = [];
    if (files && files.length > 0) {
      createdFiles = await Promise.all(
        files.map((file) =>
          prisma.file.create({
            data: {
              post: file.filename,
              postPath: `${baseUrl}/uploads/post/${file.filename}`,
              postId: createdPost.id,
            },
          })
        )
      );
    }

    // 3. Return the post with its files
    return res.status(201).json({
      message: "Post created successfully",
      data: {
        ...createdPost,
        files: createdFiles,
      },
    });
  } catch (error) {
    console.error("Create post error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const getPost = async (req, res) => {
  const userId = req.user.id;
  const baseUrl = process.env.baseUrl;

  try {
    const userPosts = await prisma.user_Post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        files: true,
        likes: {
          select: {
            user: {
              select: {
                bio: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const postsWithDetails = userPosts.map((post) => {
      const likedUsers = post.likes.map(
        (like) => like.user?.bio?.username || "Unknown"
      );

      return {
        id: post.id,
        description: post.description,
        userId: post.userId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        files: post.files.map((file) => ({
          id: file.id,
          post: file.post,
          postPath: `${baseUrl}/uploads/post/${file.post}`,
          postId: file.postId,
        })),
        likeCount: likedUsers.length,
        likedUsers, // only usernames
      };
    });

    return res.status(200).json({
      message: "User posts fetched successfully.",
      data: postsWithDetails,
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};



export const updatePost = async (req, res) => {
  const { description } = req.body;
  const postId = parseInt(req.params.postId);

  try {
    const postExists = await prisma.user_Post.findUnique({
      where: { id: postId },
    });

    if (!postExists) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Update only description here; file updates handled separately
    const updatedPost = await prisma.user_Post.update({
      where: { id: postId },
      data: { description },
    });

    return res.status(200).json({
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.error("Update post error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const deletePost = async (req, res) => {
  const postId = parseInt(req.params.postId);
  const baseUploadPath = path.join("uploads", "post");

  try {
    // 1. Find the post with files
    const post = await prisma.user_Post.findUnique({
      where: { id: postId },
      include: { files: true },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // 2. Delete all files physically
    for (const file of post.files) {
      const filePath = path.join(baseUploadPath, file.post);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log("Deleted file:", filePath);
        } catch (err) {
          console.error("Failed to delete file:", filePath, err);
        }
      }
    }

    // 3. Delete file records from DB
    await prisma.file.deleteMany({
      where: { postId: post.id },
    });

    // 4. Delete the post record
    await prisma.user_Post.delete({
      where: { id: post.id },
    });

    return res
      .status(200)
      .json({ message: "Post and files deleted successfully." });
  } catch (error) {
    console.error("Delete post error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};
