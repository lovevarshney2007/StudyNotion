import express from "express";


import authRoutes from "./routes/AuthRoutes";

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use("/api/v1/auth", authRoutes);

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
