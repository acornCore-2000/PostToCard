import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import tweetRoute from "./routes/tweet.routes.js";


const app = express();
const port = 5000;
dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/api", tweetRoute);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
