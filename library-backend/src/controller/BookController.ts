import { Request, Response } from "express";
import Book from "../models/Book.model";
import { Op, fn, col } from "sequelize";

class BookController {
  public static async getBookById(req: Request, res: Response): Promise<void> {
    const bookId = parseInt(req.params.id);

    try {
      const book = await Book.findByPk(bookId);

      if (!book) {
        res.status(404).json({
          message: "Không tìm thấy sách",
          statusCode: 404,
        });
        return;
      }

      res.status(200).json({
        book: book,
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

  public static async getBooks(req: Request, res: Response): Promise<void> {
    try {
      const books = await Book.findAll({
        order: [["book_id", "DESC"]],
      });
      res.status(200).json({
        message: "Lấy thành công sách",
        books: books,
      });
      return;
    } catch (err) {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách sách", error: err });
    }
    return;
  }

  public static async getAllBooks(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    try {
      const books = await Book.findAll({
        offset: offset,
        limit: limit,
        order: [["book_id", "DESC"]],
      });
      res.status(200).json({
        message: "Lấy thành công sách",
        books: books,
      });
      return;
    } catch (err) {
      console.error("Error fetching books:", err);
      res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách sách", error: err });
      return;
    }
  }

  public static async createBook(req: Request, res: Response): Promise<void> {
    const { title, author, publisher, year, genre, price, status } = req.body;

    try {
      const newBook = await Book.create({
        title,
        author,
        publisher,
        year,
        genre,
        price,
        status,
      });

      res.status(201).json({
        message: "Sách đã được tạo mới",
        book: newBook,
      });
      return;
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi tạo sách", error: err });
      return;
    }
  }

  public static async updateBook(req: Request, res: Response): Promise<void> {
    const book_id = req.params.id;
    const { title, author, publisher, year, genre, price, status } = req.body;

    try {
      const book = await Book.findByPk(book_id);

      if (!book) {
        res.status(404).json({ message: "Sách không tồn tại" });
        return;
      }

      await book.update({
        title: title || book.title,
        author: author || book.author,
        publisher: publisher || book.publisher,
        year: year || book.year,
        genre: genre || book.genre,
        price: price || book.price,
        status: status || book.status,
      });

      res.status(200).json({
        message: "Sách đã được cập nhật",
        book,
      });
      return;
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi cập nhật sách", error: err });
      return;
    }
  }

  public static async deleteBook(req: Request, res: Response): Promise<void> {
    const book_id = req.params.id;

    try {
      const book = await Book.findByPk(book_id);

      if (!book) {
        res.status(404).json({ message: "Sách không tồn tại" });
        return;
      }

      await book.destroy();

      res.status(200).json({
        message: "Sách đã được xoá",
      });
      return;
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi xoá sách", error: err });
      return;
    }
  }

  public static async getBooksByGenre(req: Request, res: Response) {
    try {
      const { genre } = req.params;
      if (!genre) {
        res.status(400).json({
          message: "Thể loại là bắt buộc.",
        });
        return;
      }
      const books = await Book.findAll({
        where: { genre },
      });
      if (books.length === 0) {
        res.status(404).json({
          message: `Không có sách thuộc thể loại: ${genre}`,
        });
        return;
      }

      res.status(200).json({
        message: `Danh sách sách thuộc thể loại: ${genre}`,
        data: books,
      });
      return;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sách theo thể loại:", error);
      res.status(500).json({
        message: "Lỗi khi lấy danh sách sách theo thể loại.",
        error,
      });
      return;
    }
  }
  public static async searchBooks(req: Request, res: Response) {
    try {
      const { params } = req.params;
      if (!params || typeof params !== "string" || params.trim() === "") {
        res.status(400).json({
          message: "Vui lòng cung cấp từ khóa tìm kiếm hợp lệ.",
        });
        return;
      }

      const books = await Book.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${params}%` } },
            { author: { [Op.like]: `%${params}%` } },
          ],
        },
      });

      if (books.length === 0) {
        res.status(404).json({
          message: `Không tìm thấy sách nào với từ khóa: ${params}`,
        });
        return;
      }
      res.status(200).json({
        message: "Kết quả tìm kiếm",
        data: books,
      });
      return;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sách:", error);
      res.status(500).json({
        message: "Lỗi khi tìm kiếm sách.",
        error,
      });
      return;
    }
  }

  public static getGenres = async (req: Request, res: Response) => {
    try {
      const genres = await Book.findAll({
        attributes: [[fn("DISTINCT", col("genre")), "genre"]],
        where: {
          genre: {
            [Op.ne]: null,
          },
        },
      });
      const genreList = genres.map((book) => book.getDataValue("genre"));
      res.status(200).json({ genres: genreList });
      return;
    } catch (error) {
      console.error("Error fetching genres:", error);
      res.status(500).json({ message: "Lỗi khi lấy danh sách genre" });
    }
  };
}

export default BookController;
