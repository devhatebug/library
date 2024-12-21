import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class News extends Model {
  public id!: number;
  public title!: string;
  public content!: string;
  public publishedAt!: Date;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

News.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "News",
    tableName: "news",
    timestamps: true,
  }
);

export default News;
