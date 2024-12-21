import { api } from "@/api/api";

export interface NewArticle {
  title: string;
  content: string;
  publishedAt: Date;
  description: string;
}

export const getNews = async (limit: number, page: number) => {
  const res = await api.get(`news/pagination?limit=${limit}&page=${page}`);
  return res.data;
};

export const getNewsById = async (news_id: number) => {
  const res = await api.get(`news/get/${news_id}`);
  return res.data;
};

export const createNews = async (news: NewArticle) => {
  const res = await api.post("news/create", news);
  return res.data;
};

export const getAllNews = async () => {
  const res = await api.get("news/all");
  return res.data;
};

export const updateNews = async (id: number, dataUpdate: NewArticle) => {
  const res = await api.put(`news/update/${id}`, dataUpdate);
  return res.data;
};

export const deleteNews = async (id: number) => {
  const res = await api.delete(`news/delete/${id}`);
  return res.data;
};
