import { Request, Response } from "express";
import Borrow from "../models/Borrow.model";
import User from "../models/User.model";
import Book from "../models/Book.model";
import { Op } from "sequelize";

class BorrowController {
  public static async getBorrowHistory(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({
          message: "Bạn cần đăng nhập để lấy lịch sử mượn sách.",
        });
        return;
      }
      const user_id = req.user.userId;
      const user = await User.findByPk(user_id, {
        attributes: ["user_id", "borrow_history"],
      });

      if (!user) {
        res.status(404).json({
          message: `Không tìm thấy người dùng với ID: ${user_id}`,
        });
        return;
      }
      if (!Array.isArray(user.borrow_history)) {
        user.borrow_history = JSON.parse(user.borrow_history || "[]");
      }
      const borrowHistory = user.borrow_history;
      const validBorrowHistory = borrowHistory.filter((id) => id != null);
      const borrowBook = await Borrow.findAll({
        where: {
          user_id: user_id,
          book_id: validBorrowHistory.length > 0 ? validBorrowHistory : [0],
        },
      });

      let books = [];

      for (const borrow of borrowBook) {
        const findBook = await Book.findByPk(borrow.book_id);
        if (findBook) {
          books.push({
            book_id: findBook.book_id,
            title: findBook.title,
            author: findBook.author,
            publisher: findBook.publisher,
            year: findBook.year,
            genre: findBook.genre,
            price: findBook.price,
            status: findBook.status,
            borrow_date: borrow.createdAt,
            return_date: borrow.return_date,
          });
        }
      }

      res.status(200).json({
        message: "Lịch sử mượn sách",
        data: books,
      });

      return;
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử mượn sách:", error);
      res.status(500).json({
        message: "Lỗi khi lấy lịch sử mượn sách.",
        error,
      });
      return;
    }
  }

  public static async borrowBook(req: Request, res: Response) {
    const { book_id } = req.body;
    if (!req.user) {
      res.status(401).json({ message: "Bạn cần đăng nhập để mượn sách." });
      return;
    }
    const user_id = req.user.userId;
    try {
      const book = await Book.findByPk(book_id);
      if (!book || book.status === "not_available") {
        res.status(400).json({ message: "Sách không có sẵn để mượn." });
        return;
      }
      if (book.status === "borrowed") {
        res.status(400).json({ message: "Sách đã được mượn." });
        return;
      }
      const user = await User.findByPk(user_id);
      if (!user) {
        res.status(404).json({ message: "Người dùng không tồn tại." });
        return;
      }

      if (user.account_type === "Normal") {
        const borrowBook = await Borrow.findAll({
          where: {
            user_id: user_id,
            return_date: { [Op.is]: null },
          },
        });

        if (borrowBook.length >= 5) {
          console.log(borrowBook.length);
          res.status(404).json({
            message:
              "Bạn đã mượn tối đa số sách có thể mượn. Vui lòng trả sách trước khi mượn tiếp!",
          });
          return;
        }
      }

      if (!Array.isArray(user.borrow_history)) {
        user.borrow_history = JSON.parse(user.borrow_history || "[]");
      }
      const isBorrow = await Borrow.findOne({
        where: {
          user_id: user.user_id,
          book_id: book_id,
          return_date: { [Op.is]: null },
        },
      });

      if (isBorrow) {
        res
          .status(400)
          .json({ message: "Bạn đã mượn sách này rồi và chưa trả." });
        return;
      }

      const borrow = await Borrow.create({
        user_id: user_id,
        book_id: book_id,
      });
      user.borrow_history.push(borrow.book_id);
      await user.save();

      res.status(200).json({
        message: "Mượn sách thành công!",
        borrow,
      });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Lỗi khi mượn sách.",
      });
      return;
    }
  }

  public static async returnBook(req: Request, res: Response) {
    const { book_id } = req.body;
    if (!req.user) {
      res.status(401).json({ message: "Bạn cần đăng nhập để trả sách." });
      return;
    }
    const user_id = req.user.userId;
    try {
      const borrow = await Borrow.findOne({
        where: {
          user_id: user_id,
          book_id: book_id,
          return_date: { [Op.is]: null },
        },
      });

      if (!borrow) {
        res.status(404).json({ message: "Người dùng chưa mượn sách này." });
        return;
      }

      const book = await Book.findByPk(book_id);
      if (!book) {
        res.status(404).json({ message: "Sách không tồn tại." });
        return;
      }

      borrow.return_date = new Date();
      await borrow.save();
      res.status(200).json({
        message: "Trả sách thành công!",
      });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Lỗi khi trả sách.",
      });
      return;
    }
  }
}

export default BorrowController;
