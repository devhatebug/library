/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { TokenPayload } from "../types/token-payload";

dotenv.config();
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader || typeof authorizationHeader !== "string") {
    res.status(401).json({ error: "No token provided" });
    return;
  }
  const token = authorizationHeader.replace("Bearer ", "").trim();
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
    return;
  }
};

export default authMiddleware;
