import prisma from "../utils/db-config.js";
import jwt from "jsonwebtoken";

// REST API - Get comments for a specific post
export const getComments = async (req, res) => {
  const { postId } = req.params;
  // const userId = req.user.id;
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId),
        //  userId: userId,
       },
      // include: { user: true },
      orderBy: { createdAt: "asc" },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments", error });
  }
};

// WebSocket handler for comments

export const handleSocketConnection = (socket, io) => {
  console.log("User connected:", socket.id);

  // Extract token sent during connection
  const token = socket.handshake.auth.token;

  let userId = null;

  try {
    const decoded = jwt.verify(token,    process.env.JWT_SECRET,);
    userId = decoded.id; // assuming your JWT payload has { id: userId }
    socket.userId = userId; // store it on socket instance
  } catch (error) {
    console.error("JWT verification failed:", error);
    socket.disconnect();
    return;
  }

  socket.on("sendComment", async ({ postId, content, parentId }) => {
    try {
      const newComment = await prisma.comment.create({
        data: {
          content,
          userId: socket.userId, // use stored userId
          postId,
          parentId: parentId || null,
        },
        include: {
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
      });

      io.emit("newComment", newComment); // broadcast to all clients
    } catch (error) {
      console.error("Socket error saving comment:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
};
