export class DatabaseConnectionError extends Error {
  // Properties
  reason = "Error connecting to database";

  constructor() {
    super();

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
