import { Sequelize, Dialect } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbHost = process.env.DB_HOST;
const dbDriver = "mysql" as Dialect;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDriver,
});

export default sequelize;
