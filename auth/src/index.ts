import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import "reflect-metadata";
import { createConnection } from "typeorm";
//import mongoose from "mongoose";

import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { currentUserRouter } from "./routes/current-user";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/NotFoundError";

const app = express();
app.use(json());

// Routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Not found route error
app.all("/*", async () => {
  throw new NotFoundError();
});

// Middlewares
app.use(errorHandler);

// Start the Server and the Mongo Database
const start = async () => {
  try {
    // await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useCreateIndex: true,
    // });
    createConnection();
    console.log("Connected to Postgres");
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log("Listining on port 3000!!!!!");
  });
};

start();
