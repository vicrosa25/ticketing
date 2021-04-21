import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {
  // Properties
  statusCode = 404;

  constructor() {
    super("Not found route");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not found" }];
  }
}
