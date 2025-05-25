import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.local_base_url || 9099;
app.get("/", (req, res) => {
  res.send("Hello People...");
});
import routes from "./src/Routes/index.js";
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running successfully on port ${PORT}`);
});
