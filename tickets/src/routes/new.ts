import express, { Request, Response } from "express";
import { requireAuth } from "@tfg-victor-rosa/common";

const router = express.Router();

router.post("/api/tickets", requireAuth, (req: Request, res: Response) => {
  // user is

  res.sendStatus(200);
});

export { router as createTicketRouter };
