import { Router } from "express";
import BorrowController from "../controller/BorrowController";
import authMiddleware from "../middleware/AuthMiddleware";

const borrowRoute = Router();

borrowRoute.post("/borrow-book", authMiddleware, BorrowController.borrowBook);
borrowRoute.post("/return-book", authMiddleware, BorrowController.returnBook);
borrowRoute.get(
  "/borrow-history",
  authMiddleware,
  BorrowController.getBorrowHistory
);

export default borrowRoute;
