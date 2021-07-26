import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import "reflect-metadata";

import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@tfg-victor-rosa/common";
import { createTicketRouter } from "./routes/createTicket";
import { showTicketRouter } from "./routes/showTicket";

const app = express();
app.set("trust proxy", true);

// Middlewares
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

// Routes
app.use(createTicketRouter);
app.use(showTicketRouter);

// Not found route error
app.all("/*", async () => {
  throw new NotFoundError();
});

// Custom Middlewares
app.use(errorHandler);

export { app };
