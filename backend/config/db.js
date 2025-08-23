import mongoose from "mongoose";

const DATABASE = process.env.DATABASE;

export const connectDB = async () => {
  await mongoose.connect(DATABASE).then(() => console.log("DB Connected"));
};
