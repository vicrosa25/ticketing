import { CustomError } from "./CustomError";

export class DatabaseConnectionError extends CustomError {
  // Properties
  statusCode = 500;
  reason = "Error connecting to database";

  constructor() {
    super("Error connecting database");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  // Mothods
  serializeErrors() {
    return [{ message: this.reason }];
  }
}
