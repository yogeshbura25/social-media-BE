import express from "express";
import dotenv from "dotenv";
import path from 'path';
import routes from "./src/Routes/index.js";
import http from "http";
import { Server } from "socket.io";
dotenv.config();

import  commentsRoutes  from "./src/Routes/commentsRoutes.js";
import { handleSocketConnection } from "./src/Controllers/commentsControllers.js";

import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
  },
});
// Register REST routes
app.use("/api/comments", commentsRoutes);

// Socket.IO connection for comments
io.on("connection", (socket) => {
  handleSocketConnection(socket, io);
});

const PORT = process.env.local_base_url || 9099;

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get("/", (req, res) => {
  res.send("Hello People...");
});
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(routes);
server.listen(9090, () => {
  console.log("Server running on port 9090");
});

app.listen(PORT, () => {
  console.log(`Server is running successfully on port ${PORT}`);
});
