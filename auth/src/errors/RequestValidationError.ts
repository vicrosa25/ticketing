import { ValidationError } from "express-validator";
import { CustomErrors } from "./CustomErrors";

export class RequestValidationError extends CustomErrors {
  // Properties
  statusCode = 400;

  // Constructor
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  // Methods
  serializeErrors() {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}
