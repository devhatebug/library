import { Request, Response } from "express";
import News from "../models/News.model";

class NewsController {
  public static async addNews(req: Request, res: Response): Promise<void> {
    try {
      const { title, content, publishedAt, description } = req.body;

      if (!title || !content || !publishedAt) {
        res.status(400).json({ message: "Missing required fields." });
        return;
      }

      const news = await News.create({
        title,
        content,
        publishedAt,
        description,
      });
      res.status(201).json({ message: "News added successfully.", data: news });
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to add news.", error: error.message });
      return;
    }
  }

  public static async updateNews(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, content, publishedAt, description } = req.body;

      const news = await News.findByPk(id);
      if (!news) {
        res.status(404).json({ message: "News not found." });
        return;
      }

      await news.update({ title, content, publishedAt, description });
      res
        .status(200)
        .json({ message: "News updated successfully.", data: news });
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to update news.", error: error.message });
      return;
    }
  }

  public static async deleteNews(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const news = await News.findByPk(id);
      if (!news) {
        res.status(404).json({ message: "News not found." });
        return;
      }

      await news.destroy();
      res.status(200).json({ message: "News deleted successfully." });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to delete news.", error: error.message });
      return;
    }
  }

  public static async getNews(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const news = await News.findAll({
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        news: news,
        message: "News fetched successfully",
      });
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to fetch news.", error: error.message });
      return;
    }
  }

  public static async getAllNews(req: Request, res: Response): Promise<void> {
    try {
      const news = await News.findAll();
      res.status(200).json({
        news: news,
        message: "News fetched successfully",
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to fetch news.", error: error.message });
      return;
    }
  }

  public static async getNewsById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const news = await News.findByPk(id);
      if (!news) {
        res.status(404).json({ message: "News not found." });
        return;
      }

      res.status(200).json(news);
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to fetch news.", error: error.message });
      return;
    }
  }
}

export default NewsController;
