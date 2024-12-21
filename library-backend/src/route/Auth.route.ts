import express from "express";
import AuthController from "../controller/AuthController";

const authRoute = express.Router();

authRoute.post("/register", AuthController.register);
authRoute.post("/login", AuthController.login);

export default authRoute;
