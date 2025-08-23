import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://aldencristrego888:planzee@cluster8.y79covs.mongodb.net/Planzee"
    )
    .then(() => console.log("DB Connected"));
};
