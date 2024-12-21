import { Router } from "express";
import NewsController from "../controller/NewsController";

const newsRouter = Router();

newsRouter.post("/create", NewsController.addNews);
newsRouter.put("/update/:id", NewsController.updateNews);
newsRouter.delete("/delete/:id", NewsController.deleteNews);
newsRouter.get("/pagination", NewsController.getNews);
newsRouter.get("/get/:id", NewsController.getNewsById);
newsRouter.get("/all", NewsController.getAllNews);

export default newsRouter;
