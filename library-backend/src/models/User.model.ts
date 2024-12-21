import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class User extends Model {
  public user_id!: number;
  public username!: string;
  public password!: string;
  public email!: string;
  public account_type!: "Normal" | "VIP" | "Admin";
  public borrow_history!: number[];
  public wishlist!: number[];
}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    account_type: {
      type: DataTypes.ENUM("Normal", "VIP", "Admin"),
      defaultValue: "Normal",
    },
    borrow_history: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    wishlist: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "user",
    timestamps: false,
  }
);

export default User;
