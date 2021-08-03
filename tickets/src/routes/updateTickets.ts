import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@tfg-victor-rosa/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").notEmpty().withMessage("title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be grater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findOne(req.params.id);

    // 1. It checkts the ticket exisis
    if (!ticket) {
      throw new NotFoundError();
    }

    // 2. It checks the user is authorize
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // 3. It checks the title and price are valid
    const { title, price } = req.body;
    ticket.title = title;
    ticket.price = price;

    // 4. Update the ticket
    await ticket.save();

    // 5. Send the updated ticket in the response
    res.send(ticket);
  }
);

export { router as updateTicketsRouter };
