import express from "express";
import { json } from "body-parser";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { currentUserRouter } from "./routes/current-user";
import { errorHandler } from "./middlewares/error-handler";

const app = express();
app.use(json());

// Routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Middlewares
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Listining on port 3000!!!!!");
});
