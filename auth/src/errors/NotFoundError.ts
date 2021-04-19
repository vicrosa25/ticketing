import { CustomErrors } from "./CustomErrors";

export class NotFoundError extends CustomErrors {
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
