import { Router } from "express";
import BookController from "../controller/BookController";
import authMiddleware from "../middleware/AuthMiddleware";

const bookRoute = Router();

bookRoute.get("/view/:id", BookController.getBookById);
bookRoute.get("/allgenres", BookController.getGenres);
bookRoute.get("/search/:params", BookController.searchBooks);
bookRoute.get("/genre/:genre", BookController.getBooksByGenre);
bookRoute.get("/get", BookController.getAllBooks);
bookRoute.get("/all", BookController.getBooks);
bookRoute.post("/create", authMiddleware, BookController.createBook);
bookRoute.put("/update/:id", authMiddleware, BookController.updateBook);
bookRoute.delete("/delete/:id", authMiddleware, BookController.deleteBook);

export default bookRoute;
