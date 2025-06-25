import prisma from "../utils/db-config.js";


export const createTag = async (req, res) => {
  const { postId, tags } = req.body;
  const userId = req.user.id;

  try {
  
    const post = await prisma.user_Post.findUnique({
      where: { id: postId },
    });

    if (!post || post.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not allowed to create tags for this post" });
    }

   
    const existingTags = await prisma.tags.findMany({
      where: { postId },
      select: { tags: true },
    });

   
    if (existingTags.length > 0) {
      return res.status(400).json({ message: "Tags already created" });
    }


    const createdTags = await Promise.all(
      tags.map((tag) =>
        prisma.tags.create({
          data: {
            tags: tag,
            postId,
          },
        })
      )
    );

    return res.status(201).json({
      message: "Tags created successfully",
      createdTags,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};


export const getPostsByTag = async (req, res) => {
  const { tag } = req.body;

  if (!tag || typeof tag !== "string") {
    return res
      .status(400)
      .json({ message: "Tag is required in request body." });
  }

  try {
   
    const matchedTags = await prisma.tags.findMany({
      where: {
        tags: {
          contains: tag.trim(),
          mode: "insensitive", 
        },
      },
      include: {
        user_Post: {
          include: {
            files: true,
            likes: true,
          },
        },
      },
    });

  
    const matchedPosts = matchedTags.map((tagEntry) => tagEntry.user_Post);

    if (matchedPosts.length === 0) {
      return res
        .status(404)
        .json({ message: `No posts found with tag ${tag}` });
    }

    return res.status(200).json({
      message: `Posts with tag ${tag} fetched successfully.`,
      data: matchedPosts,
    });
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};


export const updateTag = async (req, res) => {
  const { id } = req.params;
  const { tags } = req.body;
  const userId = req.user.id;

  try {
    const tag = await prisma.tags.findUnique({ where: { id: parseInt(id) } });
    if (!tag) return res.status(404).json({ message: "Tag not found" });

    const post = await prisma.user_Post.findUnique({
      where: { id: tag.postId },
    });

      if (tags.trim() === "") {
      await prisma.tags.deleteMany({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({ message: "All tags removed from post" });
    }
    if (!post || post.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this tag" });
    }

    const updatedTag = await prisma.tags.update({
      where: { id: parseInt(id) },
      data: { tags },
    });

    res.status(200).json(updatedTag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


