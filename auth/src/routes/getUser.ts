import express, { Request, Response } from "express";
import { User } from "../models/user";
import { NotFoundError } from "@tfg-victor-rosa/common";


const router = express.Router();

router.get("/api/users/:id", async (req: Request, res: Response) => {
  const user = await User.findOne(req.params.id);
  if (!user) {
    throw new NotFoundError();
  }
  res.send(user);
});

export { router as getUserRouter };