import express from "express";
import {
  getCurrentuser,
  loginUser,
  registerUser,
  updatePassword,
  updateProfile,
} from "../controllers/userController.js";

import authMiddleware from "../middlewares/auth.js";

const userRouter = express.Router();

//PUBLIC LINKS
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

//PRIVATE LINKS protect also
userRouter.get("/me", authMiddleware, getCurrentuser);
userRouter.put("/profile", authMiddleware, updateProfile);
userRouter.put("/password", authMiddleware, updatePassword);

export default userRouter;
