import mongoose from "mongoose"


const connectDb = () => {
  const url = process.env.MONGODB_URL;
  if (!url) {
    console.error("MONGODB_URL environment variable is not defined!");
    return;
  }

  mongoose
    .connect(url)
    .then(() => console.log("Db connected successfully"))
    .catch((error) => {
      console.error("DB connection failed:", error.message || error);
    });
};

export default connectDb;