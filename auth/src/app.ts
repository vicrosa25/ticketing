import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import "reflect-metadata";

import cookieSession from "cookie-session";

import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { currentUserRouter } from "./routes/current-user";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/NotFoundError";

const app = express();
app.set("trust proxy", true);

// to force new push

// Middlewares
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

// Routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Not found route error
app.all("/*", async () => {
  throw new NotFoundError();
});

// Custom Middlewares
app.use(errorHandler);

export { app };
