import express from "express";
import dotenv from "dotenv";
import  cors from "cors";
import cookieParser from "cookie-parser";
import connectCloudinary from "./config/cloudinary.js"
import connectDb from "./config/database.js";

import authRoutes from "./routes/AuthRoutes.js";
import profileRoutes from "./routes/ProfileRoutes.js"

import fileUpload from "express-fileupload";

dotenv.config();
connectDb();
connectCloudinary(); 

const app = express();


app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp"
}));

app.use(express.json());
app.use(cookieParser());
app.use(cors());


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);

const PORT = process.env.PORT || 4000;

app.get("/",(req,res) => {
    res.send("Server is running");
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
