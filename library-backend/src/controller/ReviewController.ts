import { Request, Response } from "express";
import Review from "../models/Review.model";

class ReviewController {
  public static async getAllReviews(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const book_id = req.params.book_id;
      const reviews = await Review.findAll({
        where: {
          book_id,
        },
      });

      res.status(200).json({
        message: "Lấy danh sách review thành công",
        data: reviews,
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({
        message: "Lỗi khi lấy danh sách review",
        error: err,
      });
    }
  }

  public static async createReview(req: Request, res: Response): Promise<void> {
    const { book_id, rating, comment, username } = req.body;
    if (!req.user) {
      res
        .status(401)
        .json({ message: "Bạn cần đăng nhập để thực hiện tác vụ này" });
      return;
    }
    const user_id = req.user.userId;
    if (!user_id || !book_id) {
      res.status(400).json({ message: "Vui lòng cung cấp user_id và book_id" });
      return;
    }
    try {
      const newReview = await Review.create({
        user_id,
        book_id,
        rating,
        comment,
        username,
      });

      res.status(201).json({
        message: "Tạo review thành công",
        review: newReview,
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({
        message: "Lỗi khi tạo review",
        error: err,
      });
    }
  }

  public static async deleteReview(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!req.user) {
      res
        .status(401)
        .json({ message: "Bạn cần đăng nhập để thực hiện tác vụ này" });
      return;
    }
    const user_id = req.user.userId;
    if (!user_id) {
      res
        .status(401)
        .json({ message: "Bạn cần đăng nhập để thực hiện tác vụ này" });
      return;
    }
    try {
      const review = await Review.findByPk(id);
      if (review?.user_id !== user_id) {
        res.status(403).json({ message: "Bạn không có quyền xóa review này" });
        return;
      }
      if (!review) {
        res.status(404).json({ message: "Review không tồn tại" });
        return;
      }
      await review.destroy();
      res.status(200).json({
        message: "Xóa review thành công",
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({
        message: "Lỗi khi xóa review",
        error: err,
      });
    }
  }
}

export default ReviewController;
