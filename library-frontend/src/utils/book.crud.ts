import { api } from "@/api/api";
import { Book } from "@/app/home";

export const borrowBook = async (book_id: number) => {
  const response = await api.post(`/borrow/borrow-book`, { book_id: book_id });
  return response.data;
};

export const getGenres = async () => {
  const response = await api.get(`/book/allgenres`);
  return response.data;
};

export const getBookByGenre = async (genre: string) => {
  const response = await api.get(`/book/genre/${genre}`);
  return response.data;
};

export const getAllBooks = async () => {
  const response = await api.get(`/book/all`);
  return response.data;
};

export const getBookDetails = async (book_id: number) => {
  const response = await api.get(`/book/view/${book_id}`);
  return response.data;
};

export const returnBook = async (book_id: number) => {
  const response = await api.post(`/borrow/return-book`, { book_id: book_id });
  return response.data;
};

export const getBookPagination = async (page: number, limit: number) => {
  const response = await api.get(`/book/get?page=${page}&limit=${limit}`);
  return response.data;
};

export const createBook = async (book: Book) => {
  const response = await api.post(`/book/create`, book);
  return response.data;
};

export const updateBook = async (book: Book, book_id: number) => {
  const response = await api.put(`/book/update/${book_id}`, book);
  return response.data;
};

export const deleteBook = async (book_id: number) => {
  const response = await api.delete(`/book/delete/${book_id}`);
  return response.data;
};
