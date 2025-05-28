import jwt from "jsonwebtoken";
import { Message } from "../utils/Message.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: Message.unauthorized,
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      email: decoded.userEmail,
      id: decoded.userId,
    };

    next(); 
  } catch (error) {
    console.error("JWT verification error:", error.message);

    return res.status(403).json({
      message: Message.forbidden,
    });
  }
};
