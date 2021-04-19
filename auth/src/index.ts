import express from "express";
import "express-async-errors";
import { json } from "body-parser";
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

app.listen(3000, () => {
  console.log("Listining on port 3000!!!!!");
});
