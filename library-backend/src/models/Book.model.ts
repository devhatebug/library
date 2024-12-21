import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Book extends Model {
  public book_id!: number;
  public title!: string;
  public author!: string;
  public publisher!: string;
  public year!: number;
  public genre!: string;
  public price!: number;
  public status!: "available" | "borrowed" | "not_available";
}

Book.init(
  {
    book_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publisher: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("available", "borrowed", "not_available"),
      allowNull: false,
      defaultValue: "available",
    },
  },
  {
    sequelize,
    modelName: "Book",
    tableName: "book",
    timestamps: false,
  }
);

export default Book;
