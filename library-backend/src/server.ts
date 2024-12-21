import express, { Application } from "express";
import sequelize from "./config/database";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./route/Auth.route";
import userRoute from "./route/User.route";
import bookRoute from "./route/Book.route";
import reviewRoute from "./route/Review.route";
import borrowRoute from "./route/Borrow.route";
import newsRouter from "./route/News.route";

dotenv.config();
const app: Application = express();
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const PORT = process.env.PORT || 8081;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/book", bookRoute);
app.use("/review", reviewRoute);
app.use("/borrow", borrowRoute);
app.use("/news", newsRouter);

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
