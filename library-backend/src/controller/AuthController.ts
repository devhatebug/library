import express, { request, response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.model";
import dotenv from "dotenv";
import HashService from "../services/HashService";

dotenv.config({ path: "./.env" });

class AuthController {
  public static async register(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const { username, email, password } = req.body;
    if (!email || !username || !password) {
      res.status(400).json({
        message: "Email, username, and password are required.",
        statusCode: 400,
      });
      return;
    }
    try {
      const existingUser = await User.findOne({
        where: { email },
      });
      const isName = await User.findOne({ where: { username } });
      if (existingUser) {
        res.status(400).json({
          message: "This email has been registered",
          statusCode: 400,
        });
        return;
      }
      if (isName) {
        res.status(400).json({
          message: "This name already exists!",
          statusCode: 400,
        });
        return;
      }
      const pass_hash = await HashService.hashPassword(password);
      const user = await User.create({
        username,
        email,
        password: pass_hash,
        account_type: "Normal",
      });
      const resUser = {
        user_id: user.user_id,
        username,
        email,
        account_type: user.account_type,
        borrow_history: user.borrow_history,
        wishlist: user.wishlist,
      };
      res.status(200).json({
        message: "Successfully created users",
        user: resUser,
      });
      return;
    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({
        message: "Server error!",
        err,
        statusCode: 500,
      });
    }
  }

  public static async login(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({
        message: "Please enter a valid username and password",
        statusCode: 400,
      });
      return;
    }
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        res.status(401).json({
          message: "This account does not exist!",
          statusCode: 401,
        });
        return;
      }
      const isPass = await HashService.comparePassword(password, user.password);
      if (!isPass) {
        res.status(401).json({
          message: "The password you entered is incorrect!",
          statusCode: 401,
        });
        return;
      }
      const token = jwt.sign(
        { userId: user.user_id, account_type: user.account_type },
        process.env.JWT_SECRET as string,
        {
          expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        }
      );
      res.status(200).json({
        message: "Login successful!",
        user: {
          user_id: user.user_id,
          email: user.email,
          username: user.username,
          account_type: user.account_type,
          borrow_history: user.borrow_history,
          wishlist: user.wishlist,
        },
        token: token,
      });
      return;
    } catch (error) {
      res.status(500).json({
        message: "Server error!",
        error,
        statusCode: 500,
      });
      return;
    }
  }
}

export default AuthController;
