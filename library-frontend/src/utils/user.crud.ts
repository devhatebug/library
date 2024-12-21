import { api } from "@/api/api";
import { Credentials } from "@/api/auth-api";

interface CredentialsWishList {
  wishlist: number[];
}
interface CredentialsEdit {
  username: string;
  email: string;
}
interface CredentialsUpdate {
  username: string;
  email: string;
  account_type: string;
}

export const addWishList = async (
  user_id: number,
  dataUpdate: CredentialsWishList
) => {
  const res = await api.put(`user/update/${user_id}`, dataUpdate);
  return res.data;
};

export const updateUserInfo = async (
  user_id: number,
  dataUpdate: CredentialsEdit
) => {
  const res = await api.put(`user/update/${user_id}`, dataUpdate);
  return res.data;
};

export const getBorrowedBooks = async () => {
  const res = await api.get(`borrow/borrow-history`);
  return res.data;
};

export const getWishList = async (user_id: number) => {
  const res = await api.get(`user/wishlist/${user_id}`);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await api.get(`user/all`);
  return res.data;
};

export const getUserPagination = async (page: number, limit: number) => {
  const res = await api.get(`user/get?page=${page}&limit=${limit}`);
  return res.data;
};

export const createUser = async (dataUser: Credentials) => {
  const res = await api.post("user/create", dataUser);
  return res.data;
};

export const updateUser = async (
  user_id: number,
  dataUpdate: CredentialsUpdate
) => {
  const res = await api.put(`user/update/${user_id}`, dataUpdate);
  return res.data;
};

export const deleteUser = async (user_id: number) => {
  const res = await api.delete(`user/delete/${user_id}`);
  return res.data;
};
