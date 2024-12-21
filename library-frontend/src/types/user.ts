export interface IUser {
  user_id: number;
  username?: string;
  email?: string;
  account_type?: string;
  borrow_history?: number[];
  wishlist?: number[];
}
