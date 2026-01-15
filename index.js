import express from "express";
import dotenv from "dotenv";
import  cors from "cors";
import cookieParser from "cookie-parser";

import connectDb from "./config/database.js";

import authRoutes from "./routes/AuthRoutes.js";

dotenv.config();

connectDb();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());


app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT || 4000;

app.get("/",(req,res) => {
    res.send("Server is running");
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
