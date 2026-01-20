import mongoose from "mongoose"


const connectDb = () =>  {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Db connected successfully"))
    .catch((error) => {
        console.log("DB connection failed");
        console.error(error);
        process.exit(1);
    })
}

export default connectDb;