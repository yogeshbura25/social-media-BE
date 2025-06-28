import prisma from "../utils/db-config.js";
import cron from "node-cron";
import fs from "fs";
import path from "path";

// Run every 30 seconds
cron.schedule("*/30 * * * * *", async () => {
  try {
    const expiredStories = await prisma.stories.findMany({
      where: {
        story_expire: {
          lt: new Date(),
        },
      },
    });

    // Delete associated image files
    for (const story of expiredStories) {
      if (story.image) {
        const filePath = path.join("uploads", "stories", story.image);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log(`Deleted image file: ${filePath}`);
          } catch (err) {
            console.error("Failed to delete image file:", filePath, err);
          }
        }
      }
    }

    // Delete stories from DB
    const result = await prisma.stories.deleteMany({
      where: {
        story_expire: {
          lt: new Date(),
        },
      },
    });

    if (result.count > 0) {
      console.log(`Deleted ${result.count} expired stories`);
    }
  } catch (error) {
    console.error("Error deleting expired stories:", error);
  }
});

export const createStories = async (req, res) => {
  const { text } = req.body;
  const image = req.file?.filename;

  const userId = req.user.id;
  const baseUrl = `${process.env.baseUrl}`;
  const imagePath = image ? `${baseUrl}/uploads/stories/${image}` : null;
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }
  try {
    const expireTime = new Date(Date.now() + 10 * 60 * 1000); //deletes  after 1 minutes
    const story = await prisma.stories.create({
      data: {
        text,
        image,
        imagePath,
        userId,
        story_expire: expireTime,
      },
    });

    return res.status(201).json({ message: "Story posted", story });
  } catch (error) {
    console.error("Error creating story:", error);
    return res.status(500).json({ message: "Failed to post story" });
  }
};

// export const deleteStory = async (req, res) => {
//   const storyID = parseInt(req.params.storyID);
//   const baseUploadPath = path.join("uploads", "stories");
//   const userId = req.user.id;

//   try {
//     const findStory = await prisma.stories.findUnique({
//       where: {
//         id: storyID,
//         userId: userId,
//       },
//     });

//     if (!findStory) {
//       return res.status(404).json({ message: "User story not found." });
//     }

//     const filePath = path.join(baseUploadPath, findStory.image); // <-- Adjust field name

//     if (fs.existsSync(filePath)) {
//       try {
//         fs.unlinkSync(filePath);
//         console.log("Deleted file:", filePath);
//       } catch (err) {
//         console.error("Failed to delete file:", filePath, err);
//       }
//     }

//     await prisma.stories.delete({
//       where: { id: findStory.id },
//     });

//   return res.status(200).json({ message: `Story deleted successfully for user ${userId}.` });

//   } catch (error) {
//     console.error("Delete story error:", error);
//     return res.status(500).json({ message: "Something went wrong." });
//   }
// };

export const getStories = async (req, res) => {
  const userId = req.user.id;
  try {
    const stories = await prisma.stories.findMany({
      where: {
        userId,
        story_expire: {
          gt: new Date(),
        },
      },
      orderBy: {
        story_expire: "asc", // Optional: order by soonest expiry first
      },
    });
  if (stories.length === 0) {
      return res.status(404).json({ message: "No active stories found for user" });
    };
    return res.status(200).json({ data: stories });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching stories" });
  }
};
