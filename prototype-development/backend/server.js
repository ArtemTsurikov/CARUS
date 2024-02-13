//global imports
import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

//local imports
import authRouter from "./routers/authRouter.js";
import userRouter from "./routers/userRouter.js";
import carRouter from "./routers/carRouter.js";
import carOfferRouter from "./routers/carOfferRouter.js";
import carRequestRouter from "./routers/carRequestRouter.js";
import reviewRouter from "./routers/reviewRouter.js";
import insuranceRouter from "./routers/insuranceRouter.js";
import supportRequestRouter from "./routers/supportRequestRouter.js";
import rentalRouter from "./routers/rentalRouter.js";

import errorMiddleware from "./middleware/errorMiddleware.js";
import HttpError from "./errors/HttpError.js";
import { addHeaders, authenticateUser } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const __dirname = dirname(fileURLToPath(import.meta.url));

// only when ready to deploy
app.use(express.static(path.resolve(__dirname, "./public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(addHeaders);

//API routes
app.get("/", (req, res) => {
  res.send(`Welcome!`);
});

app.use("/api/auth", authRouter);
app.use("/api/user", authenticateUser, userRouter);
app.use("/api/car", authenticateUser, carRouter);
app.use("/api/carOffer", authenticateUser, carOfferRouter);
app.use("/api/carRequest", authenticateUser, carRequestRouter);
app.use("/api/review", authenticateUser, reviewRouter);
app.use("/api/insurance", authenticateUser, insuranceRouter);
app.use("/api/rental", authenticateUser, rentalRouter);
app.use("/api/support", supportRequestRouter);

//Default API route
app.all("*", (req, res, next) => {
  next(new HttpError(`Cannot find ${req.originalUrl} on the server`, 404));
});

app.use(errorMiddleware.controllerErrorHandler);

const port = process.env.PORT || 5000;

//Connecting to MongoDB database and start server
try {
  const connectDB = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Connected to MongoDB host ${connectDB.connection.host}`);
  app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}
