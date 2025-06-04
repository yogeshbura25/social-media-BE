import express from "express";
import dotenv from "dotenv";
import path from 'path';
import routes from "./src/Routes/index.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.local_base_url || 9099;

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get("/", (req, res) => {
  res.send("Hello People...");
});


app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running successfully on port ${PORT}`);
});
