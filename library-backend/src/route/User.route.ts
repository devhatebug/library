import { Router } from "express";
import UserController from "../controller/UserController";
import authMiddleware from "../middleware/AuthMiddleware";

const userRoute = Router();

userRoute.get("/profile/:id", authMiddleware, UserController.getUserById);
userRoute.get("/get", authMiddleware, UserController.getAllUsers);
userRoute.get("/wishlist/:id", authMiddleware, UserController.getWishList);
userRoute.post("/create", authMiddleware, UserController.createUser);
userRoute.put("/update/:id", authMiddleware, UserController.updateUser);
userRoute.delete("/delete/:id", authMiddleware, UserController.deleteUser);
userRoute.get("/all", authMiddleware, UserController.getUsers);

export default userRoute;
