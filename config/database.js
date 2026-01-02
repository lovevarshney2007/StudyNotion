import mongoose from "mongoose"



exports.connect = () =>  {
    moongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Db connected successfully"))
    .catch((error) => {
        console.log("DB connection failed");
        console.error(error);
        process.exit(1);
    })
}