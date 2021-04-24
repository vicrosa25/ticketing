import jwt from "jsonwebtoken";
import { NextFunction } from "express";
import { Response } from "express";
import { Request } from "express";

interface UserPayload {
  id: string;
  email: string;
}

// Augmenting Request interface from Express
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Check if jwt exist
  if (!req.session?.jwt) {
    return next();
  }

  // 2. Check if jwt is valid
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (error) {}

  next();
};
