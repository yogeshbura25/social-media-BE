import prisma from "../utils/db-config.js";
import cron from "node-cron";
import fs from "fs";
import path from "path";

// Run every 30 seconds
cron.schedule("*/30 * * * * *", async () => {
  try {
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

// export const getStories = async (req, res) => {
//   const userId = req.user.id;
//   try {
//     const stories = await prisma.stories.findMany({
//       where: {
//         userId,
//         story_expire: {
//           gt: new Date(),
//         },
//       },
//       orderBy: {
//         story_expire: "asc", // Optional: order by soonest expiry first
//       },
//     });
//   if (stories.length === 0) {
//       return res.status(404).json({ message: "No active stories found for user" });
//     };
//     return res.status(200).json({ data: stories });
//   } catch (error) {
//     return res.status(500).json({ message: "Error fetching stories" });
//   }
// };
