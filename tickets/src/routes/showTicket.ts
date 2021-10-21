import express, { Request, response, Response } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@tfg-victor-rosa/common";
import { Photo } from "../models/Photo";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  // const ticket = await Ticket.findOne(req.params.id, {relations: ["photos"]});
  const ticket = await Ticket.getById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }
  res.send(ticket);
});

export { router as showTicketRouter };
