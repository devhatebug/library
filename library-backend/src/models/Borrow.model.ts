import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/database";
import User from "./User.model";
import Book from "./Book.model";

class Borrow extends Model {
  public borrow_id!: number;
  public user_id!: number;
  public book_id!: number;
  public return_date!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Borrow.init(
  {
    borrow_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "user_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    book_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Book,
        key: "book_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    return_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "borrow",
    modelName: "Borrow",
    timestamps: true,
  }
);

export default Borrow;
