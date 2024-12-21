import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./User.model";
import Book from "./Book.model";

class Review extends Model {
  public review_id!: number;
  public user_id!: number;
  public book_id!: number;
  public rating!: number;
  public comment!: string;
  public username!: string;
}

Review.init(
  {
    review_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Book,
        key: "book_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "review",
    timestamps: true,
  }
);

export default Review;
