import mongoose from "mongoose";
import config from "./secret";
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const status = mongoose.connection.readyState;

    if (status === 0) {
      await mongoose.connect(config.mongo_uri as string);
    }

    console.log("mongodb connection successful");
  } catch (err) {
    console.log("mongodb connection failed!", err);
  }
};

export default connectDB;
