import { Request, Response } from "express";
import User from "../models/User.model";
import HashService from "../services/HashService";
import Book from "../models/Book.model";
import { Op } from "sequelize";

class UserController {
  async getUserById(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.id);

    try {
      if (!req.user) {
        res.status(403).json({
          message: "Bạn không có quyền truy cập",
          statusCode: 403,
        });
        return;
      }
      if (req.user.userId !== userId) {
        res.status(403).json({
          message: "Bạn không có quyền xem thông tin người dùng này",
          statusCode: 403,
        });
        return;
      }
      const user = await User.findByPk(userId);

      if (!user) {
        res.status(404).json({
          message: "Không tìm thấy user",
          statusCode: 404,
        });
        return;
      }

      res.status(200).json({
        user: user,
        statusCode: 200,
      });
      return;
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({
        message: "Server error",
        error: err,
        statusCode: 500,
      });
      return;
    }
  }
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const users = await User.findAll({
        limit: limit,
        offset: offset,
        order: [["user_id", "DESC"]],
      });

      res.status(200).json({
        users: users,
        message: "Lấy thành công user",
      });
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách người dùng", error });
      return;
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.findAll();
      if (!req.user) {
        res.status(401).json({
          message:
            "Bạn cần đăng nhập với quyền admin để lấy danh sách người dùng",
          statusCode: 401,
        });
        return;
      }
      res.status(200).json({
        users: users,
        message: "Lấy thành công user",
      });
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách người dùng", error });
      return;
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const {
        username,
        email,
        password,
        account_type,
        borrow_history,
        wishlist,
      } = req.body;

      if (!username || !email || !password) {
        res
          .status(400)
          .json({ message: "Tên, email và mật khẩu là bắt buộc." });
        return;
      }

      const isCheckUsername = await User.findAll({
        where: { username: username },
      });
      if (isCheckUsername.length > 0) {
        res.status(400).json({ message: "username already registered!" });
        return;
      }

      const password_hash = await HashService.hashPassword(password);

      const newUser = await User.create({
        username,
        email,
        password: password_hash,
        account_type: account_type || "Normal",
        borrow_history: borrow_history || [],
        wishlist: wishlist || [],
      });

      res
        .status(201)
        .json({ message: "Tạo người dùng thành công", user: newUser });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Lỗi khi tạo người dùng", error });
      return;
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const {
        username,
        email,
        password,
        account_type,
        borrow_history,
        wishlist,
      } = req.body;
      if (!req.user) {
        res
          .status(401)
          .json({ message: "Bạn cần đăng nhập để cập nhật thông tin." });
        return;
      }
      if (req.user.userId !== userId && req.user.account_type !== "Admin") {
        res
          .status(403)
          .json({ message: "Bạn không có quyền cập nhật người dùng này." });
        return;
      }
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: "Không tìm thấy người dùng." });
        return;
      }

      if (username && username !== user.username) {
        const isCheckUsername = await User.findAll({
          where: { username: username },
        });
        if (isCheckUsername.length > 0) {
          res.status(400).json({ message: "username already registered!" });
          return;
        }
      }

      let password_hash = user.password;
      if (password) {
        password_hash = await HashService.hashPassword(password);
      }
      await user.update({
        username: username || user.username,
        email: email || user.email,
        password: password_hash,
        account_type: account_type || user.account_type,
        borrow_history: borrow_history || user.borrow_history,
        wishlist: wishlist || user.wishlist,
      });

      const resData = {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        account_type: user.account_type,
        borrow_history: user.borrow_history,
        wishlist: user.wishlist,
      };

      res
        .status(200)
        .json({ message: "Cập nhật người dùng thành công", user: resData });
      return;
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi cập nhật người dùng", error });
      return;
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;

      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: "Không tìm thấy người dùng." });
        return;
      }

      await user.destroy();
      res.status(200).json({ message: "Xóa người dùng thành công" });
      return;
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa người dùng", error });
      return;
    }
  }

  async getWishList(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.id);
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        res.status(404).json({
          message: "Không tìm thấy user",
          statusCode: 404,
        });
        return;
      }

      if (!req.user) {
        res.status(401).json({
          message: "Bạn cần đăng nhập để lấy danh sách yêu thích",
          statusCode: 401,
        });
        return;
      }
      if (req.user.userId !== userId) {
        res.status(403).json({
          message:
            "Bạn không có quyền lấy danh sách yêu thích của người dùng này",
          statusCode: 403,
        });
        return;
      }
      if (!Array.isArray(user.wishlist)) {
        user.wishlist = JSON.parse(user.wishlist || "[]");
      }
      const books = await Book.findAll({
        where: { book_id: { [Op.in]: user.wishlist } },
      });
      res.status(200).json({
        widshList: books,
        statusCode: 200,
      });
      return;
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({
        message: "Server error",
        error: err,
        statusCode: 500,
      });
      return;
    }
  }
}

export default new UserController();
