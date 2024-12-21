import { Router } from "express";
import ReviewController from "../controller/ReviewController";
import authMiddleware from "../middleware/AuthMiddleware";

const reviewRoute = Router();

reviewRoute.get("/get/:book_id", ReviewController.getAllReviews);
reviewRoute.post("/create", authMiddleware, ReviewController.createReview);
reviewRoute.delete(
  "/delete/:id",
  authMiddleware,
  ReviewController.deleteReview
);

export default reviewRoute;
